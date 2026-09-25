import { apiFetch } from "./client";

export function getAdminStats(token) {
  return apiFetch("/api/admin/stats", { token });
}

export function getEnquiries(token) {
  return apiFetch("/api/admin/enquiries", { token });
}

export function deleteEnquiry(token, id) {
  return apiFetch(`/api/admin/enquiries/${id}`, { method: "DELETE", token });
}
