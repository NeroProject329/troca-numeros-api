export class HttpError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function badRequest(message: string, details?: any) {
  return new HttpError(400, message, details);
}
export function unauthorized(message = "Não autorizado") {
  return new HttpError(401, message);
}
export function notFound(message = "Não encontrado") {
  return new HttpError(404, message);
}
