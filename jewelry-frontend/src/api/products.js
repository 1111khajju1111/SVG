import { apiFetch, API_BASE } from "./client";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80";

function resolveImage(imageUrl) {
  if (!imageUrl) return FALLBACK_IMAGE;
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE}${imageUrl}`;
}

// Maps the backend's ProductResponse shape to what the UI components expect
// (e.g. `imageUrl` -> full `image` URL, price coerced to a number).
function normalize(p) {
  return {
    id: String(p.id),
    name: p.name,
    category: p.category,
    metal: p.metal,
    stone: p.stone,
    price: Number(p.price),
    description: p.description,
    image: resolveImage(p.imageUrl),
    createdAt: p.createdAt,
  };
}

export async function getProducts(category) {
  const query =
    category && category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
  const data = await apiFetch(`/api/products${query}`);
  return data.map(normalize);
}

export async function getProduct(id) {
  const data = await apiFetch(`/api/products/${id}`);
  return normalize(data);
}

function toFormData({ name, category, metal, stone, price, description, image }) {
  const fd = new FormData();
  fd.append("name", name);
  if (category) fd.append("category", category);
  if (metal) fd.append("metal", metal);
  if (stone) fd.append("stone", stone);
  fd.append("price", price);
  if (description) fd.append("description", description);
  if (image) fd.append("image", image);
  return fd;
}

export async function createProduct(token, values) {
  const data = await apiFetch("/api/admin/products", {
    method: "POST",
    body: toFormData(values),
    isMultipart: true,
    token,
  });
  return normalize(data);
}

export async function updateProduct(token, id, values) {
  const data = await apiFetch(`/api/admin/products/${id}`, {
    method: "PUT",
    body: toFormData(values),
    isMultipart: true,
    token,
  });
  return normalize(data);
}

export async function deleteProduct(token, id) {
  await apiFetch(`/api/admin/products/${id}`, { method: "DELETE", token });
}
