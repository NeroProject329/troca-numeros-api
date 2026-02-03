import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { userRepo } from "../repositories/user.repo";
import { signToken } from "../config/jwt";
import { unauthorized } from "../utils/httpErrors";

export const authService = {
  async ensureAdminSeed() {
    // cria admin se não existir (somente 1x, com base no .env)
    const passwordHash = await bcrypt.hash(env.adminPassword, 10);
    await userRepo.upsertAdmin(env.adminEmail, passwordHash);
  },

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw unauthorized("Credenciais inválidas");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw unauthorized("Credenciais inválidas");

    const token = signToken({ sub: String(user._id), email: user.email });
    return { token };
  },
};
