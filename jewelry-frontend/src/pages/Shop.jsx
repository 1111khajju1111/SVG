import { useEffect, useMemo, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../api/products";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [active, setActive] = useState("All");

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
          Catalog
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">The full collection</h1>

        {status === "ready" && categories.length > 1 && (
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
        )}
      </div>

      {status === "loading" && (
        <p className="mx-auto max-w-6xl px-6 py-24 text-center text-sm text-current/50">
          Opening the case…
        </p>
      )}
      {status === "error" && (
        <p className="mx-auto max-w-6xl px-6 py-24 text-center text-sm text-current/50">
          Couldn't reach the studio's catalog right now. Try refreshing in a moment.
        </p>
      )}
      {status === "ready" && filtered.length === 0 && (
        <p className="mx-auto max-w-6xl px-6 py-24 text-center text-sm text-current/50">
          Nothing in this category yet.
        </p>
      )}
      {status === "ready" && filtered.length > 0 && <ProductGrid products={filtered} />}
    </div>
  );
}
