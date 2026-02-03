import jwt from "jsonwebtoken";
import { env } from "./env";

export type JwtPayload = {
  sub: string; // userId
  email: string;
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "12h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
