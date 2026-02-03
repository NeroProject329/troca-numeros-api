import { UserModel } from "../models/User";

export const userRepo = {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },
  upsertAdmin(email: string, passwordHash: string) {
    return UserModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $setOnInsert: { email: email.toLowerCase(), passwordHash, role: "ADMIN" } },
      { new: true, upsert: true }
    );
  },
};
