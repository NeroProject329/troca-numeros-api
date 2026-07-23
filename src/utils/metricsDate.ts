export const METRICS_TIMEZONE = "America/Sao_Paulo";

function partsMap(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: METRICS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  ) as Record<string, string>;
}

export function isValidDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function getWeekKeyFromDateKey(dateKey: string) {
  if (!isValidDateKey(dateKey)) {
    throw new Error("Data inválida");
  }

  const [year, month, day] = dateKey.split("-").map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day, 12)
  );

  const weekday = date.getUTCDay() || 7;

  date.setUTCDate(
    date.getUTCDate() - weekday + 1
  );

  return date.toISOString().slice(0, 10);
}

export function addDaysToDateKey(
  dateKey: string,
  amount: number
) {
  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day, 12)
  );

  date.setUTCDate(
    date.getUTCDate() + amount
  );

  return date.toISOString().slice(0, 10);
}

export function getMetricsDateParts(
  date = new Date()
) {
  const parts = partsMap(date);

  const dateKey =
    `${parts.year}-${parts.month}-${parts.day}`;

  const hour = Number(parts.hour);

  return {
    dateKey,
    hour,
    weekKey: getWeekKeyFromDateKey(dateKey),
  };
}