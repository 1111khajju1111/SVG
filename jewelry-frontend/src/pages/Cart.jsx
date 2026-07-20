import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { owner } from "../data/owner";
import { buildWhatsAppOrderLink, formatINR } from "../utils/whatsapp";

export default function Cart() {
  const { items, updateQty, removeItem, totalPrice, totalItems } = useCart();
  const [note, setNote] = useState("");

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pb-24 pt-24 text-center">
        <ShoppingBag size={40} className="text-current/30" />
        <h1 className="font-display text-3xl">Your case is empty</h1>
        <p className="max-w-xs text-sm text-current/60">
          Add a piece from the collection and it'll show up here.
        </p>
        <Link
          to="/shop"
          className="mt-2 rounded-full bg-gold-500 px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink-950"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  const whatsappLink = buildWhatsAppOrderLink(owner.whatsapp, items, totalPrice, note);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-40 pt-28 sm:pb-24 sm:pt-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
        Your case
      </p>
      <h1 className="mt-2 font-display text-4xl">
        {totalItems} {totalItems === 1 ? "piece" : "pieces"} selected
      </h1>

      <div className="mt-8 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="glass flex items-center gap-4 overflow-hidden rounded-2xl p-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base">{item.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-current/50">
                  {item.category}
                </p>
                <p className="mt-1 font-mono text-sm text-gold-500">
                  {formatINR(item.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-current/40 hover:text-current/70"
                >
                  <Trash2 size={16} />
                </button>
                <div className="glass flex items-center gap-1 rounded-full p-1">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full active:scale-95"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-5 text-center font-mono text-xs">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full active:scale-95"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="glass mt-8 rounded-2xl p-5">
        <label className="font-mono text-[10px] uppercase tracking-widest text-current/50">
          Note for the studio (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="e.g. ring size, engraving text, preferred delivery date..."
          className="mt-2 w-full rounded-xl bg-transparent text-sm outline-none placeholder:text-current/40"
        />
      </div>

      {/* Desktop total + checkout */}
      <div className="mt-8 hidden sm:block">
        <div className="glass flex items-center justify-between rounded-2xl p-5">
          <span className="font-mono text-xs uppercase tracking-widest text-current/60">
            Total
          </span>
          <span className="font-display text-2xl text-gold-500">
            {formatINR(totalPrice)}
          </span>
        </div>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 font-mono text-xs uppercase tracking-widest text-ink-950 transition-transform hover:scale-[1.01]"
        >
          <MessageCircle size={18} />
          Order via WhatsApp
        </a>
        <p className="mt-3 text-center text-xs text-current/50">
          You'll be taken to WhatsApp with your order pre-filled — the studio
          confirms availability, sizing and delivery there directly.
        </p>
      </div>

      {/* Sticky mobile total + checkout */}
      <div
        className="glass-strong fixed inset-x-0 bottom-0 z-40 p-3 shadow-glass sm:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-current/60">
            Total
          </span>
          <span className="font-display text-lg text-gold-500">
            {formatINR(totalPrice)}
          </span>
        </div>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3 font-mono text-xs uppercase tracking-widest text-ink-950"
        >
          <MessageCircle size={16} />
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
