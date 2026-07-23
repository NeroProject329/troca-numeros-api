import {
  NextFunction,
  Request,
  Response,
} from "express";

import { metricsService } from "../services/metrics.service";

export const metricsController = {
  async clicks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await metricsService.getClicks({
          period: String(
            req.query.period ?? ""
          ),

          date: String(
            req.query.date ?? ""
          ),

          hour: String(
            req.query.hour ?? ""
          ),
        });

      res.json({
        ok: true,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  },
};