import { Router } from "express";
import { domainsController } from "../controllers/domain.controller";
import { validate } from "../middlewares/validate";
import {
  createDomainSchema,
  patchDomainSchema,
  linkNumberSchema,
  setActiveNumberSchema,
} from "../validators/domain.schema";

const r = Router();

r.get("/", domainsController.list);
r.get("/dashboard/active", domainsController.listDashboard);

r.post("/", validate(createDomainSchema), domainsController.create);

r.get("/:id", domainsController.detail);
r.patch("/:id", validate(patchDomainSchema), domainsController.patch);

r.post("/:id/numbers", validate(linkNumberSchema), domainsController.linkNumber);
r.delete("/:id/numbers/:numberId", domainsController.unlinkNumber);

r.patch("/:id/active-number", validate(setActiveNumberSchema), domainsController.setActiveNumber);

export default r;
