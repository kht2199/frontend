import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { Group } from "three";

function BuildingModel() {
	const { scene } = useGLTF("/models/combined_scene.gltf") as { scene: Group };
	return <primitive object={scene} />;
}

function LoadingFallback() {
	return (
		<mesh>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color="gray" wireframe />
		</mesh>
	);
}

export default function MainPage() {
	return (
		<div style={{ width: "100%", height: "calc(100vh - 200px)", background: "#1a1a2e" }}>
			<Canvas
				camera={{ position: [50, 50, 50], fov: 60, near: 0.1, far: 10000 }}
				style={{ width: "100%", height: "100%" }}
			>
				<ambientLight intensity={0.5} />
				<directionalLight position={[100, 100, 50]} intensity={1.5} castShadow />
				<directionalLight position={[-50, 50, -50]} intensity={0.5} />
				<Suspense fallback={<LoadingFallback />}>
					<BuildingModel />
				</Suspense>
				<OrbitControls
					enablePan
					enableZoom
					enableRotate
					minDistance={5}
					maxDistance={500}
				/>
				<gridHelper args={[200, 40, "#444", "#222"]} />
			</Canvas>
		</div>
	);
}
