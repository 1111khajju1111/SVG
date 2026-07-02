import ProductCard from "./ProductCard";

export default function ProductGrid({ products, title, eyebrow }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {title && (
        <div className="mb-10">
          {eyebrow && (
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
