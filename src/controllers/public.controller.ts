import { Request, Response, NextFunction } from "express";
import { zapService } from "../services/zap.service";

export const publicController = {
  async zap(req: Request, res: Response, next: NextFunction) {
    try {
      const domain = String(req.query.domain ?? "");
      const data = await zapService.getZapByDomain(domain);
      res.json({ ok: true, ...data });
    } catch (e) {
      next(e);
    }
  },
};
