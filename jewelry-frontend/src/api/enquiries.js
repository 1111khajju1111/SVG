import { apiFetch } from "./client";

/**
 * Logs a lead (product enquiry, cart checkout, or contact form) to the
 * backend so it shows up in the admin dashboard's Enquiries stat and panel.
 * Always best-effort: a WhatsApp redirect or a "message sent" confirmation
 * should never be blocked by this call failing.
 */
export function logEnquiry({ type, productId, productName, customerName, customerContact, message }) {
  return apiFetch("/api/enquiries", {
    method: "POST",
    body: { type, productId, productName, customerName, customerContact, message },
  }).catch(() => {});
}
