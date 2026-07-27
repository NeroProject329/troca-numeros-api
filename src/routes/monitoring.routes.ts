import { Router } from "express";

import { monitoringController } from "../controllers/monitoring.controller";

const r = Router();

/*
 * GET
 * /admin/monitoring
 */
r.get(
  "/",
  monitoringController.list
);

/*
 * GET
 * /admin/monitoring/:id/incidents
 *
 * Opcional:
 * ?limit=100
 */
r.get(
  "/:id/incidents",
  monitoringController.incidents
);

/*
 * GET
 * /admin/monitoring/:id
 */
r.get(
  "/:id",
  monitoringController.detail
);

export default r;