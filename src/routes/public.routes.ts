import { Router } from "express";
import { publicController } from "../controllers/public.controller";
import { publicLimiter } from "../middlewares/rateLimit";

const r = Router();

// GET /zap?domain=meusite.com
r.get("/zap", publicLimiter, publicController.zap);

export default r;
