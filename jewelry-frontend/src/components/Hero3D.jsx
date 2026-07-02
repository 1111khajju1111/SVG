import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import GemModel from "./GemModel";

export default function Hero3D() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-vault-radial">
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 1.8]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0.4, 6.4], fov: 42 }}
        >
          <Suspense fallback={null}>
            <GemModel />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-gold-500"
        >
          The Vault &mdash; Fine Jewelry, Made Properly
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-5xl font-light leading-[1.05] text-pearl-50 dark:text-pearl-50 sm:text-7xl"
          style={{ color: "inherit" }}
        >
          Held to the light,
          <br />
          <span className="italic text-gold-400">not hidden behind it.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-6 max-w-md text-sm text-current/70"
        >
          A small studio collection of hand-proofed rings, chains and stones.
          Scroll to open the case.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="mx-auto h-9 w-6 rounded-full border border-current/30 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-gold-500" />
        </div>
      </motion.div>
    </section>
  );
}
