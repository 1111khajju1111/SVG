import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import OwnerSection from "../components/OwnerSection";
import ContactSection from "../components/ContactSection";
import { getProducts } from "../api/products";
import { getRecentlyViewed } from "../utils/recentlyViewed";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data.slice(0, 3));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    setRecent(getRecentlyViewed());
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Hero />

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
      {status === "ready" && (
        <ProductGrid products={products} eyebrow="Featured" title="Open the case" />
      )}

      {recent.length > 0 && (
        <ProductGrid products={recent} eyebrow="Welcome back" title="Recently viewed" />
      )}

      <OwnerSection />
      <ContactSection />
    </>
  );
}
