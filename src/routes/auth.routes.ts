import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validators/auth.schema";

const r = Router();

r.post("/login", validate(loginSchema), authController.login);

export default r;
