export function normalizePhone(input: string) {
  return (input || "").replace(/\D/g, ""); // só dígitos
}
