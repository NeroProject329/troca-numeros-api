import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const data = await authService.login(email, password);
      res.json({ ok: true, ...data });
    } catch (e) {
      next(e);
    }
  },
};
