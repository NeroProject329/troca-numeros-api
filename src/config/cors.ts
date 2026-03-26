import cors from "cors";
import { env } from "./env";

const allowedOrigins = (env.corsOrigin || "")
  .split(",")
  .map((item) => item.trim().replace(/\/$/, ""))
  .filter(Boolean);

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS bloqueado para origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
});