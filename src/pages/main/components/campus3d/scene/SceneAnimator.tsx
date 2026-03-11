import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ANGLE_STEP } from "../constants";
import { getSkyParams } from "../data/skyData";
import { useCampus3dStore } from "../store/campus3dStore";

export interface SceneAnimatorProps {
	warningsRef: React.MutableRefObject<THREE.Mesh[]>;
	warningMeshesRef: React.MutableRefObject<THREE.Mesh[]>;
	lightsRef: React.MutableRefObject<{
		ambient: THREE.AmbientLight | null;
		dirLight: THREE.DirectionalLight | null;
	}>;
	startTimeRef: React.MutableRefObject<number>;
}

export function SceneAnimator({
	warningsRef,
	warningMeshesRef,
	lightsRef,
	startTimeRef,
}: SceneAnimatorProps) {
	const { gl, camera } = useThree();

	useFrame(() => {
		const elapsed = Date.now() - startTimeRef.current;
		const {
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

		const hours = 10; // 아침 고정

		const sky = getSkyParams(hours);
		const lights = lightsRef.current;
		if (lights.ambient) lights.ambient.intensity = sky.ambientIntensity;
		if (lights.dirLight) {
			lights.dirLight.intensity = sky.dirIntensity;
			lights.dirLight.color.setHex(sky.dirColor);
		}
		gl.toneMappingExposure = sky.exposure;

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
