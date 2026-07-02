import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "../data/products";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-3xl">This piece isn't in the case</h1>
        <Link to="/shop" className="text-gold-500 underline">
          Back to the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 pt-32 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass overflow-hidden rounded-3xl shadow-glass"
      >
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-4xl">{product.name}</h1>
        <p className="mt-4 font-display text-2xl text-gold-500">
          {formatINR(product.price)}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-current/70">
          {product.description}
        </p>

        <div className="glass mt-8 rounded-2xl p-5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-current/50">
                Metal
              </dt>
              <dd className="mt-1">{product.metal}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-current/50">
                Stone
              </dt>
              <dd className="mt-1">{product.stone}</dd>
            </div>
          </dl>
        </div>

        <button className="mt-8 w-full rounded-full bg-gold-500 py-3 font-mono text-xs uppercase tracking-widest text-ink-950 transition-transform hover:scale-[1.01]">
          Enquire about this piece
        </button>
      </motion.div>
    </div>
  );
}
