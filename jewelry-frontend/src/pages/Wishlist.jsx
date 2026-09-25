import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../api/products";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

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

  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <div className="pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
          Saved
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">Your wishlist</h1>
      </div>

      {status === "loading" && (
        <p className="mx-auto max-w-6xl px-6 py-24 text-center text-sm text-current/50">
          Gathering your saved pieces…
        </p>
      )}
      {status === "error" && (
        <p className="mx-auto max-w-6xl px-6 py-24 text-center text-sm text-current/50">
          Couldn't reach the studio's catalog right now. Try refreshing in a moment.
        </p>
      )}
      {status === "ready" && saved.length === 0 && (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
          <Heart size={40} className="text-current/30" />
          <h2 className="font-display text-2xl">Nothing saved yet</h2>
          <p className="max-w-xs text-sm text-current/60">
            Tap the heart on any piece to keep it here for later.
          </p>
          <Link
            to="/shop"
            className="mt-2 rounded-full bg-gold-500 px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink-950"
          >
            Browse the collection
          </Link>
        </div>
      )}
      {status === "ready" && saved.length > 0 && <ProductGrid products={saved} />}
    </div>
  );
}
