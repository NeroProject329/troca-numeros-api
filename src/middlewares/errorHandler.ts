import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpErrors";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;

  res.status(status).json({
    ok: false,
    error: err?.message ?? "Erro interno",
    details: err instanceof HttpError ? err.details : undefined,
  });
}
