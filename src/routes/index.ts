import { Router } from "express";

import authRoutes from "./auth.routes";

import domainsRoutes from "./domains.routes";

import numbersRoutes from "./numbers.routes";

import metricsRoutes from "./metrics.routes";

import monitoringRoutes from "./monitoring.routes";

import publicRoutes from "./public.routes";

import { requireAuth } from "../middlewares/requireAuth";

const r = Router();

/*
 * Públicas
 */
r.use(
  "/",
  publicRoutes
);

r.use(
  "/auth",
  authRoutes
);

/*
 * Protegidas
 */
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

/*
 * Monitoramento
 */
r.use(
  "/admin/monitoring",
  requireAuth,
  monitoringRoutes
);

export default r;