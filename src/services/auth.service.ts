import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { userRepo } from "../repositories/user.repo";
import { signToken } from "../config/jwt";
import { badRequest, unauthorized } from "../utils/httpErrors";
import { UserModel } from "../models/User";

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

    const token = signToken({ sub: String(user._id), email: user.email, sessionVersion: user.sessionVersion ?? 0 });
    return { token };
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw unauthorized();
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw badRequest("A senha atual está incorreta.");
    }
    if (currentPassword === newPassword) throw badRequest("Escolha uma senha diferente da atual.");
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await UserModel.findOneAndUpdate(
      { _id: user._id, passwordHash: user.passwordHash },
      { $set: { passwordHash }, $inc: { sessionVersion: 1 } },
      { new: true }
    );
    if (!updated) throw badRequest("A senha foi alterada em outra sessão. Entre novamente.");
    return { token: signToken({ sub: String(updated._id), email: updated.email, sessionVersion: updated.sessionVersion }) };
  },
};
