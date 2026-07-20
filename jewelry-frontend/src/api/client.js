export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Thin wrapper around fetch that:
 * - prefixes API_BASE
 * - JSON-encodes `body` unless `isMultipart` is set (then `body` must already
 *   be a FormData instance — used for the admin product image upload)
 * - attaches `Authorization: Bearer <token>` when a token is passed
 * - throws a plain Error with the backend's message on non-2xx responses,
 *   matching the { status, message, timestamp } shape from GlobalExceptionHandler
 */
export async function apiFetch(path, { method = "GET", body, isMultipart = false, token } = {}) {
  const headers = {};
  if (!isMultipart && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isMultipart ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty/non-JSON body — leave data as null
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
