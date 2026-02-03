import { Request, Response, NextFunction } from "express";
import { domainService } from "../services/domain.service";

type DomainIdParams = { id: string };
type DomainUnlinkParams = { id: string; numberId: string };

export const domainsController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await domainService.list();
      res.json({ ok: true, items });
    } catch (e) {
      next(e);
    }
  },

  async listDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await domainService.listDashboardActive();
      res.json({ ok: true, items });
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await domainService.create(req.body);
      res.status(201).json({ ok: true, item: created });
    } catch (e) {
      next(e);
    }
  },

  async detail(req: Request<DomainIdParams>, res: Response, next: NextFunction) {
    try {
      const data = await domainService.getDetail(req.params.id);
      res.json({ ok: true, item: data });
    } catch (e) {
      next(e);
    }
  },

  async patch(req: Request<DomainIdParams>, res: Response, next: NextFunction) {
    try {
      const updated = await domainService.patch(req.params.id, req.body);
      res.json({ ok: true, item: updated });
    } catch (e) {
      next(e);
    }
  },

  async linkNumber(req: Request<DomainIdParams>, res: Response, next: NextFunction) {
    try {
      const { numberId } = req.body as { numberId: string };
      const updated = await domainService.linkNumber(req.params.id, numberId);
      res.json({ ok: true, item: updated });
    } catch (e) {
      next(e);
    }
  },

  async unlinkNumber(req: Request<DomainUnlinkParams>, res: Response, next: NextFunction) {
    try {
      const updated = await domainService.unlinkNumber(req.params.id, req.params.numberId);
      res.json({ ok: true, item: updated });
    } catch (e) {
      next(e);
    }
  },

  async setActiveNumber(req: Request<DomainIdParams>, res: Response, next: NextFunction) {
    try {
      const { numberId } = req.body as { numberId: string | null };
      const updated = await domainService.setActiveNumber(req.params.id, numberId);
      res.json({ ok: true, item: updated });
    } catch (e) {
      next(e);
    }
  },
};
