import { Router } from "express";
import { domainsController } from "../controllers/domain.controller";
import { validate } from "../middlewares/validate";
import { z } from "zod";
import { domainService } from "../services/domain.service";
import {
  createDomainSchema,
  patchDomainSchema,
  linkNumberSchema,
  setActiveNumberSchema,
} from "../validators/domain.schema";

const r = Router();

r.get("/", domainsController.list);
r.get("/dashboard/active", domainsController.listDashboard);
r.patch("/bulk-active-number", validate(z.object({
  domainIds: z.array(z.string().regex(/^[a-f\d]{24}$/i)).min(1).max(1000),
  numberId: z.string().regex(/^[a-f\d]{24}$/i),
  active: z.boolean(),
})), async (req, res, next) => {
  try { res.json({ ok: true, ...await domainService.bulkActive(req.body.domainIds, req.body.numberId, req.body.active) }); }
  catch (error) { next(error); }
});

r.post("/", validate(createDomainSchema), domainsController.create);

r.get("/:id", domainsController.detail);
r.patch("/:id", validate(patchDomainSchema), domainsController.patch);

r.post("/:id/numbers", validate(linkNumberSchema), domainsController.linkNumber);
r.post("/:id/numbers/all", async (req, res, next) => {
  try { res.json({ ok: true, item: await domainService.linkAllNumbers(req.params.id) }); }
  catch (error) { next(error); }
});
r.delete("/:id/numbers/:numberId", domainsController.unlinkNumber);

r.patch("/:id/active-number", validate(setActiveNumberSchema), domainsController.setActiveNumber);

export default r;
