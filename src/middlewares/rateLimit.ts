import rateLimit from "express-rate-limit";

// para /zap (público)
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // 120 req por minuto por IP
  standardHeaders: true,
  legacyHeaders: false,
});
