export function normalizeDomain(input: string) {
  let s = (input || "").trim().toLowerCase();

  // remove protocolo
  s = s.replace(/^https?:\/\//, "");

  // remove www.
  s = s.replace(/^www\./, "");

  // pega só host (remove path, query, hash)
  s = s.split("/")[0];
  s = s.split("?")[0];
  s = s.split("#")[0];

  // remove porta
  s = s.split(":")[0];

  return s;
}
