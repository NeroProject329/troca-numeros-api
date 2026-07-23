import { NumberModel } from "../models/Number";
import { clickEventRepo } from "../repositories/clickEvent.repo";
import { badRequest } from "../utils/httpErrors";

import {
  addDaysToDateKey,
  getMetricsDateParts,
  getWeekKeyFromDateKey,
  isValidDateKey,
} from "../utils/metricsDate";

export type MetricsPeriod =
  | "hour"
  | "day"
  | "week";

type MetricsQuery = {
  period?: string;
  date?: string;
  hour?: string;
};

function parsePeriod(
  value?: string
): MetricsPeriod {
  if (!value) {
    return "day";
  }

  if (
    value === "hour" ||
    value === "day" ||
    value === "week"
  ) {
    return value;
  }

  throw badRequest(
    "Período inválido. Use hour, day ou week."
  );
}

function parseDate(value?: string) {
  const fallback =
    getMetricsDateParts().dateKey;

  const dateKey = value || fallback;

  if (!isValidDateKey(dateKey)) {
    throw badRequest(
      "Data inválida. Use o formato YYYY-MM-DD."
    );
  }

  return dateKey;
}

function parseHour(value?: string) {
  const fallback =
    getMetricsDateParts().hour;

  const hour =
    value === undefined || value === ""
      ? fallback
      : Number(value);

  if (
    !Number.isInteger(hour) ||
    hour < 0 ||
    hour > 23
  ) {
    throw badRequest(
      "Hora inválida. Use um número de 0 até 23."
    );
  }

  return hour;
}

export const metricsService = {
  async getClicks(query: MetricsQuery) {
    const period = parsePeriod(
      query.period
    );

    const dateKey = parseDate(
      query.date
    );

    const hour = parseHour(
      query.hour
    );

    const weekKey =
      getWeekKeyFromDateKey(dateKey);

    const match: Record<string, unknown> =
      period === "hour"
        ? {
            dateKey,
            hour,
          }
        : period === "day"
          ? {
              dateKey,
            }
          : {
              weekKey,
            };

    const [
      currentNumbers,
      groupedClicks,
    ] = await Promise.all([
      NumberModel.find()
        .sort({
          name: 1,
          phone: 1,
        })
        .lean(),

      clickEventRepo.aggregateByNumber(
        match
      ),
    ]);

    const groupedMap = new Map(
      groupedClicks.map((item) => [
        String(item.numberId),
        item,
      ])
    );

    const items = currentNumbers.map(
      (number) => {
        const numberId = String(
          number._id
        );

        const metric =
          groupedMap.get(numberId);

        groupedMap.delete(numberId);

        return {
          numberId,
          phone: number.phone,
          attendantName: number.name,
          clicks: metric?.clicks ?? 0,
          deleted: false,
        };
      }
    );

    /*
     * Caso um número seja excluído,
     * ele continua aparecendo nos
     * períodos em que recebeu cliques.
     */
    for (
      const metric of groupedMap.values()
    ) {
      items.push({
        numberId: String(
          metric.numberId
        ),

        phone:
          metric.phoneSnapshot,

        attendantName:
          metric.attendantNameSnapshot,

        clicks: metric.clicks,
        deleted: true,
      });
    }

    items.sort((a, b) => {
      if (b.clicks !== a.clicks) {
        return b.clicks - a.clicks;
      }

      return a.attendantName.localeCompare(
        b.attendantName,
        "pt-BR"
      );
    });

    const totalClicks = items.reduce(
      (total, item) =>
        total + item.clicks,
      0
    );

    const numbersWithClicks =
      items.filter(
        (item) => item.clicks > 0
      ).length;

    const topNumber =
      items.find(
        (item) => item.clicks > 0
      ) ?? null;

    const averagePerNumber =
      items.length > 0
        ? totalClicks / items.length
        : 0;

    const periodInfo =
      period === "hour"
        ? {
            period,
            date: dateKey,
            hour,

            startDate: dateKey,
            endDate: dateKey,

            label:
              `${dateKey} • ` +
              `${String(hour).padStart(2, "0")}:00 até ` +
              `${String(hour).padStart(2, "0")}:59`,
          }
        : period === "day"
          ? {
              period,
              date: dateKey,
              hour: null,

              startDate: dateKey,
              endDate: dateKey,

              label: dateKey,
            }
          : {
              period,
              date: dateKey,
              hour: null,

              startDate: weekKey,

              endDate:
                addDaysToDateKey(
                  weekKey,
                  6
                ),

              label:
                `${weekKey} até ` +
                `${addDaysToDateKey(
                  weekKey,
                  6
                )}`,
            };

    return {
      period: periodInfo,

      summary: {
        totalClicks,
        numbersWithClicks,

        totalNumbers:
          items.length,

        averagePerNumber,
        topNumber,
      },

      items,
    };
  },
};