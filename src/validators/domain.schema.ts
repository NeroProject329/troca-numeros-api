import { z } from "zod";

export const createDomainSchema = z.object({
  domain: z.string().min(3),
});

export const patchDomainSchema = z.object({
  isActive: z.boolean().optional(),
});

export const linkNumberSchema = z.object({
  numberId: z.string().min(10),
});

export const setActiveNumberSchema = z.object({
  numberId: z.string().min(10).nullable(), // pode null para “desativar”
});
