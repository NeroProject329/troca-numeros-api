import { Request, Response, NextFunction } from "express";
import { numberService } from "../services/number.service";

type NumberIdParams = { id: string };

export const numbersController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await numberService.list();
      res.json({ ok: true, items });
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await numberService.create(req.body);
      res.status(201).json({ ok: true, item: created });
    } catch (e) {
      next(e);
    }
  },

  async patch(req: Request<NumberIdParams>, res: Response, next: NextFunction) {
    try {
      const updated = await numberService.update(req.params.id, req.body);
      res.json({ ok: true, item: updated });
    } catch (e) {
      next(e);
    }
  },

  async remove(req: Request<NumberIdParams>, res: Response, next: NextFunction) {
    try {
      const deleted = await numberService.remove(req.params.id);
      res.json({ ok: true, item: deleted });
    } catch (e) {
      next(e);
    }
  },
};
