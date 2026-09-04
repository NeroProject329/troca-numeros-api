import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validators/auth.schema";
import { z } from "zod";
import { requireAuth } from "../middlewares/requireAuth";
import { authService } from "../services/auth.service";

const r = Router();

r.post("/login", validate(loginSchema), authController.login);
r.patch("/password", requireAuth, validate(z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
})), async (req, res, next) => {
  try {
    const data = await authService.changePassword(req.user!.sub, req.body.currentPassword, req.body.newPassword);
    res.json({ ok: true, ...data });
  } catch (error) { next(error); }
});

export default r;
