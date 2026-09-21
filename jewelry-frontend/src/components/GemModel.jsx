import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Float,
  ContactShadows,
  Environment,
} from "@react-three/drei";

// Cheap, one-time device check used to scale 3D quality down on phones and
// other low-power hardware. MeshTransmissionMaterial in particular renders
// an extra offscreen pass per sample, so this one flag is what keeps the
// hero from dragging down the whole page on Android.
function useIsLowPower() {
  return useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const coarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches;
    const fewCores = (navigator.hardwareConcurrency || 8) <= 4;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return Boolean(coarsePointer || fewCores || reducedMotion);
  }, []);
}

function Gem({ isLowPower }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={meshRef} castShadow={!isLowPower}>
        <octahedronGeometry args={[1.4, 0]} />
        {/* MeshTransmissionMaterial re-renders the scene through an offscreen
            buffer per sample, every frame. samples=10 / resolution=512 /
            backside=true (the previous settings) were tuned for a desktop
            demo, not a phone — this was the single biggest cause of the lag.
            Scaling those down on low-power devices keeps the same look at a
            fraction of the GPU cost. */}
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.04}
          transmission={1}
          ior={2.3}
          chromaticAberration={0.04}
          anisotropy={0.25}
          distortion={0.12}
          distortionScale={0.25}
          temporalDistortion={0}
          backside={false}
          samples={isLowPower ? 1 : 4}
          resolution={isLowPower ? 128 : 256}
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
  const isLowPower = useIsLowPower();

  return (
    <>
      {/* HDRI environment: gives the transmission material something to refract
          and the gold band something to reflect. background={false} keeps the
          canvas itself transparent so the CSS gradient behind it still shows.
          resolution is capped lower on weak devices — this preset is fetched
          once and cached, but blurring/convolving it at 512 vs 128 is real
          GPU work every session's first paint. */}
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={1.1}
        resolution={isLowPower ? 128 : 256}
      />

      <ambientLight intensity={0.6} />
      <spotLight
        position={[5, 6, 5]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#F7F5F0"
        castShadow={!isLowPower}
      />
      <spotLight position={[-5, -3, -4]} angle={0.4} intensity={1.6} color="#C9A15A" />
      {/* Rim light so the gem's silhouette reads against the dark hero background */}
      <pointLight position={[0, 1, -4]} intensity={2} color="#E8D5A8" />

      <Gem isLowPower={isLowPower} />
      <Band />
      {!isLowPower && (
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.45}
          scale={8}
          blur={2.4}
          far={3}
          color="#000000"
          resolution={256}
          frames={1}
        />
      )}
    </>
  );
}
