// Normalises Kenyan mobile numbers to 2547XXXXXXXX / 2541XXXXXXXX.
// Accepts 07xx, 01xx, 7xx, 254..., +254..., with spaces/dashes.
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "").replace(/^\+/, "");
  const m = digits.match(/^(?:254|0)?([17]\d{8})$/);
  return m ? `254${m[1]}` : null;
}