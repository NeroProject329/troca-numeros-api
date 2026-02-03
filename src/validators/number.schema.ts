import { z } from "zod";

export const createNumberSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
});

export const patchNumberSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
});
