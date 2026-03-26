import express from "express";
import { corsMiddleware } from "./config/cors";
import routes from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(corsMiddleware);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use(routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
