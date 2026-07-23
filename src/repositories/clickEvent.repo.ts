import { ClickEventModel } from "../models/ClickEvent";

export type CreateClickEventInput = {
  numberId: string;
  domainId: string;

  phoneSnapshot: string;
  attendantNameSnapshot: string;
  domainSnapshot: string;

  dateKey: string;
  hour: number;
  weekKey: string;

  clickedAt: Date;
};

export const clickEventRepo = {
  create(data: CreateClickEventInput) {
    return ClickEventModel.create(data);
  },

  aggregateByNumber(
    match: Record<string, unknown>
  ) {
    return ClickEventModel.aggregate<{
      numberId: string;
      clicks: number;
      phoneSnapshot: string;
      attendantNameSnapshot: string;
    }>([
      {
        $match: match,
      },

      {
        $sort: {
          clickedAt: 1,
        },
      },

      {
        $group: {
          _id: "$numberId",

          clicks: {
            $sum: 1,
          },

          phoneSnapshot: {
            $last: "$phoneSnapshot",
          },

          attendantNameSnapshot: {
            $last: "$attendantNameSnapshot",
          },
        },
      },

      {
        $project: {
          _id: 0,

          numberId: {
            $toString: "$_id",
          },

          clicks: 1,
          phoneSnapshot: 1,
          attendantNameSnapshot: 1,
        },
      },
    ]);
  },
};