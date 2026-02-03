import { Router } from "express";
import authRoutes from "./auth.routes";
import domainsRoutes from "./domains.routes";
import numbersRoutes from "./numbers.routes";
import publicRoutes from "./public.routes";
import { requireAuth } from "../middlewares/requireAuth";

const r = Router();

r.use("/", publicRoutes);
r.use("/auth", authRoutes);

r.use("/admin/domains", requireAuth, domainsRoutes);
r.use("/admin/numbers", requireAuth, numbersRoutes);

export default r;
