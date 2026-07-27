import {
  NextFunction,
  Request,
  Response,
} from "express";

import { monitoringService } from "../services/monitoring.service";

type MonitorIdParams = {
  id: string;
};

export const monitoringController = {
  async list(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await monitoringService
          .list();

      res.json({
        ok: true,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  },

  async detail(
    req: Request<MonitorIdParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const item =
        await monitoringService
          .detail(
            req.params.id
          );

      res.json({
        ok: true,
        item,
      });
    } catch (error) {
      next(error);
    }
  },

  async incidents(
    req: Request<MonitorIdParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await monitoringService
          .incidents(
            req.params.id,

            String(
              req.query.limit ??
                ""
            )
          );

      res.json({
        ok: true,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  },
};