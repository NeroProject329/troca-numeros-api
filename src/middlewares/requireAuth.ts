import { NextFunction, Request, Response } from "express";
import { unauthorized } from "../utils/httpErrors";
import { verifyToken } from "../config/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return next(unauthorized());

  const token = h.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch {
    next(unauthorized("Token inválido ou expirado"));
  }
}
