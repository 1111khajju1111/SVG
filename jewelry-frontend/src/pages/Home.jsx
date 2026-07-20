import { useEffect, useState } from "react";
import Hero3D from "../components/Hero3D";
import ProductGrid from "../components/ProductGrid";
import OwnerSection from "../components/OwnerSection";
import ContactSection from "../components/ContactSection";
import { getProducts } from "../api/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Hero3D />

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

      <OwnerSection />
      <ContactSection />
    </>
  );
}
