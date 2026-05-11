export function formatMoney(amount: number | string | null | undefined, currency = "GHS") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount ?? 0;
  if (!isFinite(n as number)) return `${currency} 0.00`;
  return `${currency} ${(n as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function discountPercent(source?: number | string | null, selling?: number | string | null) {
  const s = typeof source === "string" ? parseFloat(source) : source ?? 0;
  const p = typeof selling === "string" ? parseFloat(selling) : selling ?? 0;
  if (!s || !p || s <= p) return 0;
  return Math.round(((s - p) / s) * 100);
}
