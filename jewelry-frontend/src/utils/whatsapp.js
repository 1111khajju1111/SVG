function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Builds a wa.me link pre-filled with the cart contents so the owner
 * receives a readable order/customization request instantly — this is
 * the "checkout" for this store, there's no payment step.
 */
export function buildWhatsAppOrderLink(whatsappNumber, items, totalPrice, note = "") {
  const lines = [
    "Hi! I'd like to order the following from The Vault:",
    "",
    ...items.map(
      (i) => `- ${i.name} (x${i.qty}) — ${formatINR(i.price * i.qty)}`
    ),
    "",
    `Total: ${formatINR(totalPrice)}`,
  ];

  if (note.trim()) {
    lines.push("", `Note: ${note.trim()}`);
  }

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

export function buildWhatsAppEnquiryLink(whatsappNumber, productName) {
  const message = encodeURIComponent(
    `Hi! I'm interested in the "${productName}" — could you tell me more or customize it for me?`
  );
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

export { formatINR };
