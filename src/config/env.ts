import "dotenv/config";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3333),

  mongoUrl: required("MONGO_URL"),
  jwtSecret: required("JWT_SECRET"),

  corsOrigin: process.env.CORS_ORIGIN ?? "*",

  adminEmail: required("ADMIN_EMAIL"),
  adminPassword: required("ADMIN_PASSWORD"),
};
