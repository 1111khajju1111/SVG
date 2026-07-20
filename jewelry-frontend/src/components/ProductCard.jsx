import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductCard({ product }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.55, once: false });
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="glass overflow-hidden rounded-3xl shadow-glass transition-transform duration-500 hover:-translate-y-1"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-glass transition-colors ${
              added ? "bg-gold-500 text-ink-950" : "glass-strong text-current active:scale-95"
            }`}
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>

          {/* Loupe / tissue-reveal price panel */}
          <motion.div
            aria-hidden={!inView}
            initial={false}
            animate={{ y: inView ? "0%" : "0%" }}
            className="absolute inset-x-0 bottom-0 overflow-hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: inView ? "0%" : "100%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong flex items-center justify-between px-4 py-3"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-current/60">
                Price
              </span>
              <span className="font-display text-lg text-gold-500">
                {formatINR(product.price)}
              </span>
            </motion.div>
          </motion.div>
        </div>

        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-current/50">
            {product.category}
          </p>
          <h3 className="mt-1 font-display text-xl">{product.name}</h3>
          <p className="mt-1 text-xs text-current/60">{product.metal}</p>
        </div>
      </motion.article>
    </Link>
  );
}
