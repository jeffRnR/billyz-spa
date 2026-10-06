// Canonical format: local, e.g. 0712345678 / 0112345678.
// Accepts 07xx, 01xx, 7xx, 254..., +254..., with spaces/dashes.
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "").replace(/^\+/, "");
  const m = digits.match(/^(?:254|0)?([17]\d{8})$/);
  return m ? `0${m[1]}` : null;
}

// Daraja needs 2547XXXXXXXX. Use only inside modules/payments/mpesa.
export function toMsisdn(local: string): string {
  return `254${local.slice(1)}`;
}