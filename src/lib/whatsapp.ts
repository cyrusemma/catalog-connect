import { formatMoney } from "./format";

export type CartLine = { title: string; quantity: number; price: number };

export function buildWhatsAppOrderUrl(opts: {
  number: string;
  items: CartLine[];
  currency: string;
  customerName?: string;
  customerPhone?: string;
}) {
  const lines = opts.items
    .map((i) => `• ${i.title} x${i.quantity} — ${formatMoney(i.price * i.quantity, opts.currency)}`)
    .join("\n");
  const total = opts.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const msg = [
    "Hello, I want to order:",
    "",
    lines,
    "",
    `Total: ${formatMoney(total, opts.currency)}`,
    "",
    opts.customerName ? `Name: ${opts.customerName}` : "Name:",
    opts.customerPhone ? `Phone: ${opts.customerPhone}` : "Phone:",
  ].join("\n");
  const num = opts.number.replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

export function buildWhatsAppShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
