import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Float,
  ContactShadows,
  Environment,
} from "@react-three/drei";

function Gem() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[1.4, 0]} />
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.04}
          transmission={1}
          ior={2.3}
          chromaticAberration={0.05}
          anisotropy={0.3}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.1}
          backside
          backsideThickness={0.5}
          samples={10}
          resolution={512}
          color="#E8D5A8"
          attenuationColor="#C9A15A"
          attenuationDistance={0.8}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

function Band() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.15;
  });
  return (
    // Radius (2.05) is deliberately larger than the gem's reach (octahedron
    // radius 1.4) and centered at the gem's own height (y = 0), with only a
    // shallow tilt — like Saturn's rings. That combination means the band
    // stays outside the gem's silhouette at every point in its orbit instead
    // of precessing through it.
    <mesh ref={ref} position={[0, 0, 0]} rotation={[Math.PI / 2 - 0.22, 0, 0]}>
      <torusGeometry args={[2.05, 0.05, 32, 100]} />
      <meshStandardMaterial
        color="#C9A15A"
        metalness={1}
        roughness={0.2}
        envMapIntensity={1.6}
      />
    </mesh>
  );
}

export default function GemModel() {
  return (
    <>
      {/* HDRI environment: gives the transmission material something to refract
          and the gold band something to reflect. background={false} keeps the
          canvas itself transparent so the CSS gradient behind it still shows. */}
      <Environment preset="studio" background={false} environmentIntensity={1.1} />

      <ambientLight intensity={0.6} />
      <spotLight
        position={[5, 6, 5]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#F7F5F0"
        castShadow
      />
      <spotLight position={[-5, -3, -4]} angle={0.4} intensity={1.6} color="#C9A15A" />
      {/* Rim light so the gem's silhouette reads against the dark hero background */}
      <pointLight position={[0, 1, -4]} intensity={2} color="#E8D5A8" />

      <Gem />
      <Band />
      <ContactShadows position={[0, -2, 0]} opacity={0.45} scale={8} blur={2.4} far={3} color="#000000" />
    </>
  );
}
