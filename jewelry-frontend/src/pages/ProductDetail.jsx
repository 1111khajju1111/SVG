import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, MessageCircle, Check } from "lucide-react";
import { owner } from "../data/owner";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";
import { buildWhatsAppEnquiryLink, formatINR } from "../utils/whatsapp";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getProduct(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-current/50">
        Opening the case…
      </div>
    );
  }

  if (status === "error" || !product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-3xl">This piece isn't in the case</h1>
        <Link to="/shop" className="text-gold-500 underline">
          Back to the collection
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-32 pt-28 sm:pb-24 sm:pt-32 md:grid-cols-2">
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

        {/* Quantity selector */}
        <div className="mt-8 flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-current/50">
            Quantity
          </span>
          <div className="glass flex items-center gap-1 rounded-full p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full active:scale-95"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-mono text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full active:scale-95"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Desktop / inline actions (hidden on small screens — sticky bar takes over) */}
        <div className="mt-6 hidden flex-col gap-3 sm:flex">
          <button
            onClick={handleAddToCart}
            className={`w-full rounded-full py-3 font-mono text-xs uppercase tracking-widest transition-transform hover:scale-[1.01] ${
              added ? "bg-gold-300 text-ink-950" : "bg-gold-500 text-ink-950"
            }`}
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
          <a
            href={buildWhatsAppEnquiryLink(owner.whatsapp, product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex w-full items-center justify-center gap-2 rounded-full py-3 font-mono text-xs uppercase tracking-widest text-current transition-transform hover:scale-[1.01]"
          >
            <MessageCircle size={16} />
            Ask about customizing this piece
          </a>
        </div>
      </motion.div>

      {/* Sticky mobile action bar */}
      <div
        className="glass-strong fixed inset-x-0 bottom-0 z-40 flex gap-2 p-3 shadow-glass sm:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={buildWhatsAppEnquiryLink(owner.whatsapp, product.name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ask on WhatsApp"
          className="glass flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        >
          <MessageCircle size={20} />
        </a>
        <button
          onClick={handleAddToCart}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full font-mono text-xs uppercase tracking-widest transition-colors ${
            added ? "bg-gold-300 text-ink-950" : "bg-gold-500 text-ink-950"
          }`}
        >
          {added ? <Check size={16} /> : null}
          {added ? "Added" : `Add to cart · ${formatINR(product.price * qty)}`}
        </button>
      </div>
    </div>
  );
}
