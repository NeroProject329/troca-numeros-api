import { Router } from "express";

import authRoutes from "./auth.routes";
import domainsRoutes from "./domains.routes";
import numbersRoutes from "./numbers.routes";
import metricsRoutes from "./metrics.routes";
import publicRoutes from "./public.routes";

import { requireAuth } from "../middlewares/requireAuth";

const r = Router();

r.use("/", publicRoutes);

r.use(
  "/auth",
  authRoutes
);

r.use(
  "/admin/domains",
  requireAuth,
  domainsRoutes
);

r.use(
  "/admin/numbers",
  requireAuth,
  numbersRoutes
);

r.use(
  "/admin/metrics",
  requireAuth,
  metricsRoutes
);

export default r;