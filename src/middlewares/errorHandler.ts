import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpErrors";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const duplicate = err?.code === 11000;
  const invalid = err?.name === "CastError" || err?.name === "ValidationError";
  const status = err instanceof HttpError ? err.status : duplicate ? 409 : invalid ? 400 : 500;

  res.status(status).json({
    ok: false,
    error: duplicate ? "Este telefone ou domínio já está cadastrado." : invalid ? "Identificador ou dados inválidos. Atualize a página e tente novamente." : err?.message ?? "Erro interno",
    details: err instanceof HttpError ? err.details : undefined,
  });
}
