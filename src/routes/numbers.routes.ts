import { Router } from "express";
import { numbersController } from "../controllers/number.controller";
import { validate } from "../middlewares/validate";
import { createNumberSchema, patchNumberSchema } from "../validators/number.schema";

const r = Router();

r.get("/", numbersController.list);
r.post("/", validate(createNumberSchema), numbersController.create);
r.patch("/:id", validate(patchNumberSchema), numbersController.patch);
r.delete("/:id", numbersController.remove);

export default r;
