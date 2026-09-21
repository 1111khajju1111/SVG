import { useEffect, useState, Suspense, lazy } from "react";
import ProductGrid from "../components/ProductGrid";
import OwnerSection from "../components/OwnerSection";
import ContactSection from "../components/ContactSection";
import { getProducts } from "../api/products";

// three.js + drei are the heaviest thing this app ships (well over half the
// JS bundle). Loading Hero3D lazily means the rest of the home page — nav,
// product grid, footer — can paint immediately instead of waiting on that
// download and parse first.
const Hero3D = lazy(() => import("../components/Hero3D"));

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
      <Suspense fallback={<div className="h-screen w-full bg-sss-radial bg-ink-950" />}>
        <Hero3D />
      </Suspense>

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
