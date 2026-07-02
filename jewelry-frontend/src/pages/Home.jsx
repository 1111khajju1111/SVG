import Hero3D from "../components/Hero3D";
import ProductGrid from "../components/ProductGrid";
import OwnerSection from "../components/OwnerSection";
import ContactSection from "../components/ContactSection";
import { products } from "../data/products";

export default function Home() {
  return (
    <>
      <Hero3D />
      <ProductGrid
        products={products.slice(0, 3)}
        eyebrow="Featured"
        title="Open the case"
      />
      <OwnerSection />
      <ContactSection />
    </>
  );
}
