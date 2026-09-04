import { NextFunction, Request, Response } from "express";
import { unauthorized } from "../utils/httpErrors";
import { verifyToken } from "../config/jwt";
import { UserModel } from "../models/User";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return next(unauthorized());

  const token = h.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    const user = await UserModel.findById(payload.sub).select("sessionVersion").lean();
    if (!user || Number(user.sessionVersion ?? 0) !== (payload.sessionVersion ?? 0)) {
      return next(unauthorized("Sessão encerrada. Entre novamente."));
    }
    req.user = payload;
    next();
  } catch {
    next(unauthorized("Token inválido ou expirado"));
  }
}
