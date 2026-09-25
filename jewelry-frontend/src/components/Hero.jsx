import { motion } from "framer-motion";

// Ten fixed sparkle positions around the gem. Half are hidden below `sm` —
// a handful of composited divs cost nothing, but there's no reason to pay
// even that on the smallest screens.
const SPARKLES = [
  { top: "18%", left: "22%", size: 5, delay: 0, duration: 3.2 },
  { top: "68%", left: "16%", size: 4, delay: 0.6, duration: 3.6 },
  { top: "30%", left: "78%", size: 4, delay: 1.1, duration: 3 },
  { top: "76%", left: "72%", size: 6, delay: 0.3, duration: 3.8 },
  { top: "12%", left: "58%", size: 3, delay: 1.6, duration: 3.4 },
  { top: "52%", left: "10%", size: 3, delay: 2, duration: 3.2, mobile: false },
  { top: "40%", left: "88%", size: 5, delay: 0.9, duration: 3.6, mobile: false },
  { top: "84%", left: "42%", size: 3, delay: 1.4, duration: 3, mobile: false },
  { top: "8%", left: "36%", size: 3, delay: 0.4, duration: 3.4, mobile: false },
  { top: "60%", left: "84%", size: 4, delay: 1.8, duration: 3.8, mobile: false },
];

/**
 * The gem: a flat-shaded pentagon "brilliant cut" silhouette, fanned into
 * five facets from one interior point so the shading tiles perfectly with
 * no gaps. Table (top) brightest, crown facets mid-gold, pavilion facets
 * deepen toward the culet — the same read as the old WebGL render, at
 * effectively zero runtime cost.
 */
function GemMark() {
  return (
    <div className="hero-float relative mx-auto h-56 w-56 sm:h-72 sm:w-72">
      <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_18px_40px_rgba(201,161,90,0.35)]">
        <defs>
          <linearGradient id="facetTable" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7F5F0" />
            <stop offset="100%" stopColor="#E8D5A8" />
          </linearGradient>
          <linearGradient id="facetCrownL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8D5A8" />
            <stop offset="100%" stopColor="#D9BD82" />
          </linearGradient>
          <linearGradient id="facetCrownR" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8D5A8" />
            <stop offset="100%" stopColor="#C9A15A" />
          </linearGradient>
          <linearGradient id="facetPavL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C9A15A" />
            <stop offset="100%" stopColor="#8A6C38" />
          </linearGradient>
          <linearGradient id="facetPavR" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#AD8748" />
            <stop offset="100%" stopColor="#6B5228" />
          </linearGradient>
          <clipPath id="gemClip">
            <polygon points="72,26 128,26 182,74 100,182 18,74" />
          </clipPath>
        </defs>

        {/* Facets, fanned from the interior point (100,64) */}
        <polygon points="72,26 128,26 100,64" fill="url(#facetTable)" />
        <polygon points="128,26 182,74 100,64" fill="url(#facetCrownR)" />
        <polygon points="182,74 100,182 100,64" fill="url(#facetPavR)" />
        <polygon points="100,182 18,74 100,64" fill="url(#facetPavL)" />
        <polygon points="18,74 72,26 100,64" fill="url(#facetCrownL)" />

        {/* Facet edges */}
        <g fill="none" stroke="#0B0D14" strokeOpacity="0.25" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="72,26 128,26 182,74 100,182 18,74" />
          <line x1="72" y1="26" x2="100" y2="64" />
          <line x1="128" y1="26" x2="100" y2="64" />
          <line x1="182" y1="74" x2="100" y2="64" />
          <line x1="18" y1="74" x2="100" y2="64" />
          <line x1="100" y1="182" x2="100" y2="64" />
        </g>

        {/* Shimmer sweep, clipped to the gem's own silhouette */}
        <g clipPath="url(#gemClip)">
          <rect
            className="hero-shimmer"
            x="-40"
            y="-40"
            width="60"
            height="280"
            fill="rgba(247,245,240,0.55)"
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-sss-radial">
      {/* Ambient gradient orbs — plain radial-gradient divs, no filter:blur
          (expensive on mobile GPUs), just soft-edged gradients drifting via
          transform. */}
      <div
        aria-hidden
        className="hero-orb-a pointer-events-none absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(201,161,90,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="hero-orb-b pointer-events-none absolute -bottom-1/4 -right-1/4 h-[65%] w-[65%] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(232,213,168,0.18), transparent 70%)",
        }}
      />

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className={`hero-sparkle pointer-events-none absolute rounded-full bg-gold-300 ${
            s.mobile === false ? "hidden sm:block" : ""
          }`}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            ["--twinkle-opacity"]: 0.85,
          }}
        />
      ))}

      <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <GemMark />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 mt-6 font-mono text-xs uppercase tracking-[0.35em] text-gold-500"
        >
          SSS Jewelry &mdash; Fine Jewelry, Made Properly
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
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
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-6 max-w-md text-sm text-current/70"
        >
          A small studio collection of hand-proofed rings, chains and stones.
          Scroll to open the case.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="mx-auto h-9 w-6 rounded-full border border-current/30 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-gold-500" />
        </div>
      </motion.div>
    </section>
  );
}
