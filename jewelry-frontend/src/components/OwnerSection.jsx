import { motion } from "framer-motion";
import { owner } from "../data/products";

export default function OwnerSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="glass grid grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl p-8 shadow-glass md:grid-cols-[280px_1fr] md:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto aspect-square w-48 overflow-hidden rounded-full border border-gold-500/30 md:w-full"
        >
          <img
            src={owner.image}
            alt={owner.name}
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
            {owner.title}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">{owner.name}</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-current/70">
            {owner.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
