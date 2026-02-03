import { env } from "./config/env";
import { connectMongo } from "./database/mongo";
import { createApp } from "./app";
import { authService } from "./services/auth.service";

async function main() {
  await connectMongo();

  // cria admin se não existir (ADMIN_EMAIL / ADMIN_PASSWORD)
  await authService.ensureAdminSeed();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[API] running on http://localhost:${env.port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
