import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { getSkyParams } from "./buildingData";
import { useCampus3dStore } from "./campus3dStore";
import { LoadingOverlay } from "./LoadingOverlay";
import { MinimapOverlay, MinimapRenderer } from "./Minimap";
import type { TimeMode } from "./types";
import { use3DModel } from "./use3DModel";

/* ============================================================================
 * 상수
 * ============================================================================ */
export interface Campus3DRef {
	setWarningBuildings: (names: string[]) => void;
}

const CAM_POS = new THREE.Vector3(21, 13, -17);
const CAM_TARGET = new THREE.Vector3(8, 9, -10);
const DEG15 = (15 * Math.PI) / 180;
const INIT_PHI = 1.04;
export const ANGLE_STEP = (5 * Math.PI) / 180;

const SKIP_NAMES = new Set(["Scene", "Ground"]);

/* ============================================================================
 * 건물 이름 탐색 (hit mesh → 부모 체인 walk-up)
 * ============================================================================ */
function findBuildingName(
	obj: THREE.Object3D,
	groups: Record<string, THREE.Object3D>,
): string | null {
	let cur: THREE.Object3D | null = obj;
	while (cur) {
		if (cur.name && groups[cur.name] && !SKIP_NAMES.has(cur.name))
			return cur.name;
		cur = cur.parent;
	}
	return null;
}

/* ============================================================================
 * SceneAnimator — useFrame으로 sky/blink/smoke/window/label 갱신
 * 모든 UI 상태는 useCampus3dStore.getState()로 읽음 (re-render 없음)
 * ============================================================================ */
interface SceneAnimatorProps {
	warningsRef: React.MutableRefObject<THREE.Mesh[]>;
	warningMeshesRef: React.MutableRefObject<THREE.Mesh[]>;
	lightsRef: React.MutableRefObject<{
		ambient: THREE.AmbientLight | null;
		dirLight: THREE.DirectionalLight | null;
	}>;
	sunMeshRef: React.MutableRefObject<THREE.Mesh | null>;
	startTimeRef: React.MutableRefObject<number>;
}

function SceneAnimator({
	warningsRef,
	warningMeshesRef,
	lightsRef,
	sunMeshRef,
	startTimeRef,
}: SceneAnimatorProps) {
	const { gl, camera, scene } = useThree();

	useFrame(() => {
		const elapsed = Date.now() - startTimeRef.current;
		const {
			timeMode,
			camInputFocused,
			camXEl,
			camYEl,
			camZEl,
			camDEl,
			tgtXEl,
			tgtYEl,
			tgtZEl,
			controls,
		} = useCampus3dStore.getState();

		// 시간대 계산
		let hours: number;
		if (timeMode === "morning") hours = 10;
		else if (timeMode === "night") hours = 0;
		else {
			const now = new Date();
			hours = now.getHours() + now.getMinutes() / 60;
		}

		const sky = getSkyParams(hours);
		if (scene.background instanceof THREE.Color)
			scene.background.setRGB(sky.r, sky.g, sky.b);
		if (scene.fog instanceof THREE.FogExp2)
			scene.fog.color.setRGB(sky.r, sky.g, sky.b);

		const lights = lightsRef.current;
		if (lights.ambient) lights.ambient.intensity = sky.ambientIntensity;
		if (lights.dirLight) {
			lights.dirLight.intensity = sky.dirIntensity;
			lights.dirLight.color.setHex(sky.dirColor);
		}
		gl.toneMappingExposure = sky.exposure;

		// 태양 위치
		if (sky.sunPos && sunMeshRef.current) {
			sunMeshRef.current.position.set(sky.sunPos.x, sky.sunPos.y, sky.sunPos.z);
			sunMeshRef.current.visible = true;
			if (sky.sunUp && lights.dirLight)
				lights.dirLight.position.copy(sunMeshRef.current.position);
		} else if (sunMeshRef.current) {
			sunMeshRef.current.visible = false;
			if (lights.dirLight) lights.dirLight.position.set(100, 300, 100);
		}

		// 경고등 점멸
		for (const mesh of warningsRef.current) {
			if (mesh.material && "emissiveIntensity" in mesh.material) {
				(mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
					Math.sin(elapsed * 0.006) > 0 ? 1.0 : 0.1;
			}
		}

		// 경고 건물 점멸
		for (const mesh of warningMeshesRef.current) {
			if (!mesh.material || !("emissiveIntensity" in mesh.material)) continue;
			(mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
				0.05 + ((Math.sin(elapsed * 0.005) + 1) / 2) * 0.75;
		}

		// 카메라 각도 스냅
		if (controls && !camInputFocused) {
			const cam = camera as THREE.PerspectiveCamera;
			const snapOffset = new THREE.Vector3().subVectors(
				cam.position,
				controls.target,
			);
			const sph = new THREE.Spherical().setFromVector3(snapOffset);
			sph.theta = Math.round(sph.theta / ANGLE_STEP) * ANGLE_STEP;
			sph.phi = Math.round(sph.phi / ANGLE_STEP) * ANGLE_STEP;
			sph.phi = Math.max(
				controls.minPolarAngle,
				Math.min(controls.maxPolarAngle, sph.phi),
			);
			snapOffset.setFromSpherical(sph);
			cam.position.copy(controls.target).add(snapOffset);
			cam.lookAt(controls.target);
		}

		// 카메라 입력창 갱신
		if (controls && !camInputFocused) {
			const cam = camera as THREE.PerspectiveCamera;
			if (camXEl) camXEl.value = Math.round(cam.position.x).toString();
			if (camYEl) camYEl.value = Math.round(cam.position.y).toString();
			if (camZEl) camZEl.value = Math.round(cam.position.z).toString();
			if (camDEl)
				camDEl.value = Math.round(
					cam.position.distanceTo(controls.target),
				).toString();
			if (tgtXEl) tgtXEl.value = Math.round(controls.target.x).toString();
			if (tgtYEl) tgtYEl.value = Math.round(controls.target.y).toString();
			if (tgtZEl) tgtZEl.value = Math.round(controls.target.z).toString();
		}
	});

	return null;
}

/* ============================================================================
 * CampusScene — Canvas 내부 R3F 씬 컴포넌트 (props 없음)
 * use3DModel을 직접 호출하고, 로컬 mesh ref들을 SceneAnimator에 전달
 * ============================================================================ */
function CampusScene() {
	const { camera, scene, gl } = useThree();
	const lightsRef = useRef<{
		ambient: THREE.AmbientLight | null;
		dirLight: THREE.DirectionalLight | null;
	}>({ ambient: null, dirLight: null });
	const sunMeshRef = useRef<THREE.Mesh | null>(null);
	const startTimeRef = useRef(Date.now());

	const {
		model,
		buildingGroupsRef,
		buildingNames,
		groundBox,
		warningsRef,
		warningMeshesRef,
		setWarningBuildings,
	} = use3DModel();

	// warningBuildings 변경 감지 → setWarningBuildings 호출
	const warningBuildings = useCampus3dStore((s) => s.warningBuildings);
	useEffect(() => {
		setWarningBuildings(warningBuildings);
	}, [warningBuildings, setWarningBuildings]);

	// 씬 배경/안개 + 미니맵 카메라 초기화
	// useLayoutEffect: 첫 useFrame 실행 전에 scene.background가 확실히 설정되도록
	// biome-ignore lint/correctness/useExhaustiveDependencies: scene is stable from useThree
	useLayoutEffect(() => {
		scene.background = new THREE.Color(0x345384);
		scene.fog = new THREE.FogExp2(0x345384, 0.0006);
		const mmCam = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 2000);
		mmCam.up.set(0, 0, 1);
		mmCam.position.set(CAM_TARGET.x, 800, CAM_TARGET.z);
		mmCam.lookAt(CAM_TARGET.x, 0, CAM_TARGET.z);
		useCampus3dStore.setState({ minimapCamera: mmCam });
	}, []);

	// 카메라를 스토어에 등록
	useEffect(() => {
		useCampus3dStore.setState({ camera: camera as THREE.PerspectiveCamera });
	}, [camera]);

	// 모델 로드 완료 시 스토어에 건물 데이터 저장
	// biome-ignore lint/correctness/useExhaustiveDependencies: buildingGroupsRef is stable
	useEffect(() => {
		if (buildingNames.length === 0) return;
		const boxes: Record<
			string,
			{ corners: THREE.Vector3[]; center: THREE.Vector3 }
		> = {};
		for (const [name, group] of Object.entries(buildingGroupsRef.current)) {
			const box = new THREE.Box3().setFromObject(group);
			const center = new THREE.Vector3();
			box.getCenter(center);
			const y = center.y;
			boxes[name] = {
				corners: [
					new THREE.Vector3(box.min.x, y, box.min.z),
					new THREE.Vector3(box.max.x, y, box.min.z),
					new THREE.Vector3(box.max.x, y, box.max.z),
					new THREE.Vector3(box.min.x, y, box.max.z),
				],
				center,
			};
		}
		useCampus3dStore.setState({
			buildingNames,
			buildingGroups: buildingGroupsRef.current,
			buildingBoxes: boxes,
		});
	}, [buildingNames]);

	// Ground 박스로 미니맵 카메라 범위 설정
	useEffect(() => {
		if (!groundBox) return;
		const mmCam = useCampus3dStore.getState().minimapCamera;
		if (!mmCam) return;
		const center = new THREE.Vector3();
		groundBox.getCenter(center);
		const size = new THREE.Vector3();
		groundBox.getSize(size);
		const half = (Math.max(size.x, size.z) / 2) * 0.6;
		mmCam.left = -half;
		mmCam.right = half;
		mmCam.top = half;
		mmCam.bottom = -half;
		mmCam.up.set(0, 0, 1);
		mmCam.position.set(center.x, 800, center.z);
		mmCam.lookAt(center.x, 0, center.z);
		mmCam.updateProjectionMatrix();
	}, [groundBox]);

	const handlePointerMove = useCallback(
		(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
			e.stopPropagation();
			const name = findBuildingName(e.object, buildingGroupsRef.current);
			gl.domElement.style.cursor = name ? "pointer" : "default";
		},
		[gl, buildingGroupsRef],
	);

	const handlePointerOut = useCallback(() => {
		gl.domElement.style.cursor = "default";
	}, [gl]);

	return (
		<>
			{/* 조명 */}
			<ambientLight
				ref={(el) => {
					lightsRef.current.ambient = el;
				}}
				color={0x8899bb}
				intensity={1.4}
			/>
			<directionalLight
				ref={(el) => {
					lightsRef.current.dirLight = el;
				}}
				color={0xfff0dd}
				intensity={2.2}
				position={[300, 500, 200]}
				castShadow
				shadow-mapSize={[4096, 4096]}
				shadow-camera-left={-600}
				shadow-camera-right={600}
				shadow-camera-top={600}
				shadow-camera-bottom={-600}
				shadow-camera-near={0.5}
				shadow-camera-far={1500}
				shadow-bias={-0.0005}
				shadow-normalBias={0.02}
			/>

			{/* 태양 */}
			<mesh ref={sunMeshRef} visible={false}>
				<sphereGeometry args={[22, 32, 32]} />
				<meshBasicMaterial color={0xffee66} />
				<mesh>
					<sphereGeometry args={[35, 32, 32]} />
					<meshBasicMaterial color={0xffcc33} transparent opacity={0.3} />
				</mesh>
				<mesh>
					<sphereGeometry args={[50, 32, 32]} />
					<meshBasicMaterial color={0xffaa22} transparent opacity={0.12} />
				</mesh>
			</mesh>

			{/* OrbitControls — 마운트 시 스토어에 등록 */}
			<OrbitControls
				ref={(el: OrbitControlsImpl | null) => {
					if (el) useCampus3dStore.setState({ controls: el });
				}}
				target={CAM_TARGET.toArray() as [number, number, number]}
				enableDamping={false}
				rotateSpeed={0.5}
				minDistance={1}
				maxDistance={700}
				minPolarAngle={Math.max(0.1, INIT_PHI - DEG15)}
				maxPolarAngle={Math.min(Math.PI / 2 - 0.05, INIT_PHI + DEG15)}
				enablePan
			/>

			{/* 건물 모델 */}
			{model && (
				<primitive
					object={model}
					onPointerMove={handlePointerMove}
					onPointerOut={handlePointerOut}
				/>
			)}

			{/* 애니메이션 루프 */}
			<SceneAnimator
				warningsRef={warningsRef}
				warningMeshesRef={warningMeshesRef}
				lightsRef={lightsRef}
				sunMeshRef={sunMeshRef}
				startTimeRef={startTimeRef}
			/>

			{/* 미니맵 렌더 */}
			<MinimapRenderer />
		</>
	);
}

/* ============================================================================
 * Campus3D — 최상위 컴포넌트 (forwardRef + HTML UI)
 * UI 상태는 useCampus3dStore 셀렉터로 읽고, 이벤트 핸들러는 getState()로 직접 접근
 * ============================================================================ */
const Campus3D = forwardRef<Campus3DRef>(function Campus3D(_, ref) {
	// UI 상태 구독
	const buildingNames = useCampus3dStore((s) => s.buildingNames);
	const timeMode = useCampus3dStore((s) => s.timeMode);
	const focusBuilding = useCampus3dStore((s) => s.focusBuilding);
	const warningBuildings = useCampus3dStore((s) => s.warningBuildings);

	// 언마운트 시 스토어 초기화
	useEffect(() => {
		return () => {
			useCampus3dStore.setState({
				camera: null,
				controls: null,
				minimapCamera: null,
				buildingGroups: {},
				buildingBoxes: {},
				buildingNames: [],
				containerEl: null,
				minimap2dEl: null,
				camXEl: null,
				camYEl: null,
				camZEl: null,
				camDEl: null,
				tgtXEl: null,
				tgtYEl: null,
				tgtZEl: null,
				loading: true,
				loadProgress: 0,
				focusBuilding: "",
				warningBuildings: [],
				timeMode: "morning",
			});
		};
	}, []);

	// forwardRef: warningBuildings를 스토어에 써서 CampusScene이 감지
	useImperativeHandle(ref, () => ({
		setWarningBuildings: (names) =>
			useCampus3dStore.setState({ warningBuildings: names }),
	}));

	// 건물 포커스
	const handleFocusBuilding = useCallback((name: string) => {
		useCampus3dStore.setState({ focusBuilding: name });
		if (!name) return;
		const { controls, buildingGroups } = useCampus3dStore.getState();
		const group = buildingGroups[name];
		if (!group || !controls) return;
		const box = new THREE.Box3().setFromObject(group);
		const center = new THREE.Vector3();
		box.getCenter(center);
		controls.target.copy(center);
		controls.update();
	}, []);

	// 카메라 리셋
	const handleReset = useCallback(() => {
		const { camera: cam, controls } = useCampus3dStore.getState();
		if (cam) cam.position.copy(CAM_POS);
		if (controls) {
			controls.target.copy(CAM_TARGET);
			controls.update();
		}
		useCampus3dStore.setState({ focusBuilding: "" });
	}, []);

	const timeModes: { value: TimeMode; label: string }[] = [
		{ value: "morning", label: "아침 (Morning)" },
		{ value: "auto", label: "실시간 (Realtime)" },
		{ value: "night", label: "밤 (Night)" },
	];

	return (
		<div
			ref={(el) => useCampus3dStore.setState({ containerEl: el })}
			style={{ width: "100%", height: "100%", position: "relative" }}
		>
			{/* R3F Canvas */}
			<Canvas
				camera={{
					fov: 45,
					position: CAM_POS.toArray() as [number, number, number],
					near: 1,
					far: 5000,
				}}
				shadows
				gl={{
					antialias: true,
					toneMapping: THREE.ACESFilmicToneMapping,
					toneMappingExposure: 1.6,
				}}
				style={{ width: "100%", height: "100%" }}
			>
				<CampusScene />
			</Canvas>

			<LoadingOverlay />

			{/* 상단 좌측 컨트롤 */}
			<div
				style={{
					position: "absolute",
					top: 20,
					left: 24,
					zIndex: 100,
					display: "flex",
					gap: 10,
				}}
			>
				{/* 시간 모드 */}
				<select
					value={timeMode}
					onChange={(e) =>
						useCampus3dStore.setState({ timeMode: e.target.value as TimeMode })
					}
					style={selectStyle}
				>
					{timeModes.map((m) => (
						<option key={m.value} value={m.value}>
							{m.label}
						</option>
					))}
				</select>

				{/* 건물 선택 */}
				<select
					value={focusBuilding}
					onChange={(e) => handleFocusBuilding(e.target.value)}
					style={selectStyle}
				>
					<option value="">건물 선택...</option>
					{buildingNames.map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</select>

				{/* 카메라 X */}
				<label style={inputLabelStyle}>
					<span style={inputAxisLabelStyle}>X</span>
					<input
						ref={(el) => useCampus3dStore.setState({ camXEl: el })}
						type="number"
						step="10"
						defaultValue="0"
						onChange={(e) => {
							const val = Number(e.target.value);
							if (!Number.isFinite(val)) return;
							const { camera: cam, controls } = useCampus3dStore.getState();
							if (!cam || !controls) return;
							cam.position.x = val;
							cam.lookAt(controls.target);
							controls.update();
						}}
						onFocus={() => useCampus3dStore.setState({ camInputFocused: true })}
						onBlur={() => useCampus3dStore.setState({ camInputFocused: false })}
						style={{ ...inputStyle, width: 60 }}
					/>
				</label>

				{/* 카메라 Y */}
				<label style={inputLabelStyle}>
					<span style={inputAxisLabelStyle}>Y</span>
					<input
						ref={(el) => useCampus3dStore.setState({ camYEl: el })}
						type="number"
						step="10"
						defaultValue="0"
						onChange={(e) => {
							const val = Number(e.target.value);
							if (!Number.isFinite(val)) return;
							const { camera: cam, controls } = useCampus3dStore.getState();
							if (!cam || !controls) return;
							cam.position.y = val;
							cam.lookAt(controls.target);
							controls.update();
						}}
						onFocus={() => useCampus3dStore.setState({ camInputFocused: true })}
						onBlur={() => useCampus3dStore.setState({ camInputFocused: false })}
						style={{ ...inputStyle, width: 60 }}
					/>
				</label>

				{/* 카메라 Z */}
				<label style={inputLabelStyle}>
					<span style={inputAxisLabelStyle}>Z</span>
					<input
						ref={(el) => useCampus3dStore.setState({ camZEl: el })}
						type="number"
						step="10"
						defaultValue="0"
						onChange={(e) => {
							const val = Number(e.target.value);
							if (!Number.isFinite(val)) return;
							const { camera: cam, controls } = useCampus3dStore.getState();
							if (!cam || !controls) return;
							cam.position.z = val;
							cam.lookAt(controls.target);
							controls.update();
						}}
						onFocus={() => useCampus3dStore.setState({ camInputFocused: true })}
						onBlur={() => useCampus3dStore.setState({ camInputFocused: false })}
						style={{ ...inputStyle, width: 60 }}
					/>
				</label>

				{/* 카메라 거리 */}
				<label style={inputLabelStyle}>
					<span style={inputAxisLabelStyle}>Dist</span>
					<input
						ref={(el) => useCampus3dStore.setState({ camDEl: el })}
						type="number"
						step="10"
						min="150"
						max="700"
						defaultValue="0"
						onChange={(e) => {
							const dist = Number(e.target.value);
							if (!Number.isFinite(dist) || dist <= 0) return;
							const { camera: cam, controls } = useCampus3dStore.getState();
							if (!cam || !controls) return;
							const dir = new THREE.Vector3()
								.subVectors(cam.position, controls.target)
								.normalize();
							cam.position.copy(controls.target).addScaledVector(dir, dist);
							cam.lookAt(controls.target);
							controls.update();
						}}
						onFocus={() => useCampus3dStore.setState({ camInputFocused: true })}
						onBlur={() => useCampus3dStore.setState({ camInputFocused: false })}
						style={{ ...inputStyle, width: 55 }}
					/>
				</label>

				<div
					style={{
						width: 1,
						height: 20,
						background: "rgba(255,255,255,0.15)",
						alignSelf: "center",
					}}
				/>

				{/* 타겟 TX */}
				<label style={inputLabelStyle}>
					<span style={{ ...inputAxisLabelStyle, color: "#666" }}>TX</span>
					<input
						ref={(el) => useCampus3dStore.setState({ tgtXEl: el })}
						type="number"
						step="10"
						defaultValue="0"
						onChange={(e) => {
							const val = Number(e.target.value);
							if (!Number.isFinite(val)) return;
							const { camera: cam, controls } = useCampus3dStore.getState();
							if (!cam || !controls) return;
							controls.target.x = val;
							cam.lookAt(controls.target);
							controls.update();
						}}
						onFocus={() => useCampus3dStore.setState({ camInputFocused: true })}
						onBlur={() => useCampus3dStore.setState({ camInputFocused: false })}
						style={{ ...inputStyle, width: 60, color: "#aaa" }}
					/>
				</label>

				{/* 타겟 TY */}
				<label style={inputLabelStyle}>
					<span style={{ ...inputAxisLabelStyle, color: "#666" }}>TY</span>
					<input
						ref={(el) => useCampus3dStore.setState({ tgtYEl: el })}
						type="number"
						step="10"
						defaultValue="0"
						onChange={(e) => {
							const val = Number(e.target.value);
							if (!Number.isFinite(val)) return;
							const { camera: cam, controls } = useCampus3dStore.getState();
							if (!cam || !controls) return;
							controls.target.y = val;
							cam.lookAt(controls.target);
							controls.update();
						}}
						onFocus={() => useCampus3dStore.setState({ camInputFocused: true })}
						onBlur={() => useCampus3dStore.setState({ camInputFocused: false })}
						style={{ ...inputStyle, width: 60, color: "#aaa" }}
					/>
				</label>

				{/* 타겟 TZ */}
				<label style={inputLabelStyle}>
					<span style={{ ...inputAxisLabelStyle, color: "#666" }}>TZ</span>
					<input
						ref={(el) => useCampus3dStore.setState({ tgtZEl: el })}
						type="number"
						step="10"
						defaultValue="0"
						onChange={(e) => {
							const val = Number(e.target.value);
							if (!Number.isFinite(val)) return;
							const { camera: cam, controls } = useCampus3dStore.getState();
							if (!cam || !controls) return;
							controls.target.z = val;
							cam.lookAt(controls.target);
							controls.update();
						}}
						onFocus={() => useCampus3dStore.setState({ camInputFocused: true })}
						onBlur={() => useCampus3dStore.setState({ camInputFocused: false })}
						style={{ ...inputStyle, width: 60, color: "#aaa" }}
					/>
				</label>

				{/* 경고 건물 선택 */}
				<select
					value={warningBuildings[0] ?? ""}
					onChange={(e) => {
						const val = e.target.value;
						useCampus3dStore.setState({ warningBuildings: val ? [val] : [] });
					}}
					style={{
						...selectStyle,
						color: "#f87171",
						border: "1px solid rgba(248,113,113,0.3)",
						minWidth: 120,
					}}
				>
					<option value="">경고 건물...</option>
					{buildingNames.map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</select>
			</div>

			{/* Reset 버튼 */}
			<button
				type="button"
				onClick={handleReset}
				style={{
					position: "absolute",
					top: 20,
					right: 24,
					zIndex: 100,
					...buttonStyle,
				}}
			>
				&#8634; Reset
			</button>

			<MinimapOverlay />

			<style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        select option { background: #0a0a14; color: #ddd; }
      `}</style>
		</div>
	);
});

export default Campus3D;

/* ── 공통 인라인 스타일 ─────────────────────────────────────────────────────── */
const selectStyle: React.CSSProperties = {
	background: "rgba(10,10,20,0.85)",
	color: "#ddd",
	border: "1px solid rgba(255,255,255,0.12)",
	borderRadius: 8,
	padding: "8px 14px",
	fontSize: 13,
	fontFamily: "'Noto Sans KR', sans-serif",
	backdropFilter: "blur(12px)",
	cursor: "pointer",
	outline: "none",
};

const inputLabelStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: 4,
	background: "rgba(10,10,20,0.85)",
	border: "1px solid rgba(255,255,255,0.12)",
	borderRadius: 8,
	padding: "0 10px",
	backdropFilter: "blur(12px)",
};

const inputAxisLabelStyle: React.CSSProperties = {
	fontSize: 11,
	color: "#888",
	fontFamily: "monospace",
};

const inputStyle: React.CSSProperties = {
	background: "transparent",
	color: "#ddd",
	border: "none",
	fontSize: 12,
	fontFamily: "monospace",
	outline: "none",
	padding: "8px 0",
	MozAppearance: "textfield",
};

const buttonStyle: React.CSSProperties = {
	background: "rgba(10,10,20,0.85)",
	color: "#ddd",
	border: "1px solid rgba(255,255,255,0.12)",
	borderRadius: 8,
	padding: "8px 14px",
	fontSize: 13,
	fontFamily: "'Noto Sans KR', sans-serif",
	backdropFilter: "blur(12px)",
	cursor: "pointer",
	outline: "none",
};
