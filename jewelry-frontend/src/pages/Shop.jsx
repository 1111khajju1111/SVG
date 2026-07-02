import { useMemo, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

export default function Shop() {
  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    []
  );
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
          Catalog
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">The full collection</h1>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
                active === c
                  ? "bg-gold-500 text-ink-950"
                  : "glass text-current/70 hover:text-gold-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ProductGrid products={filtered} />
    </div>
  );
}
