const STORAGE_KEY = "sss-recently-viewed";
const MAX_ITEMS = 8;

function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Records a product as viewed. Call this from the product detail page. */
export function recordView(product) {
  if (!product?.id) return;
  const existing = read().filter((p) => p.id !== product.id);
  const next = [
    { id: product.id, name: product.name, image: product.image, category: product.category, price: product.price, metal: product.metal },
    ...existing,
  ].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full/unavailable — recently viewed is a nice-to-have, fail silently
  }
}

/** Returns viewed products, most recent first, optionally excluding one id. */
export function getRecentlyViewed(excludeId) {
  return read().filter((p) => p.id !== excludeId);
}
