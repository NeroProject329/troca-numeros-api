import { Router } from "express";
import { metricsController } from "../controllers/metrics.controller";

const r = Router();

r.get(
  "/clicks",
  metricsController.clicks
);

export default r;