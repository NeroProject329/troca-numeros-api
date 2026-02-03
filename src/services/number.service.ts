import { numberRepo } from "../repositories/number.repo";
import { normalizePhone } from "../utils/normalizePhone";
import { badRequest, notFound } from "../utils/httpErrors";

export const numberService = {
  list() {
    return numberRepo.list();
  },

  async create(data: { name: string; phone: string }) {
    const phone = normalizePhone(data.phone);
    if (!phone) throw badRequest("Telefone inválido");
    return numberRepo.create({ name: data.name.trim(), phone });
  },

  async update(id: string, data: Partial<{ name: string; phone: string }>) {
    const patch: any = {};
    if (data.name) patch.name = data.name.trim();
    if (data.phone) patch.phone = normalizePhone(data.phone);

    const updated = await numberRepo.update(id, patch);
    if (!updated) throw notFound("Número não encontrado");
    return updated;
  },

  async remove(id: string) {
    const deleted = await numberRepo.delete(id);
    if (!deleted) throw notFound("Número não encontrado");
    return deleted;
  },
};
