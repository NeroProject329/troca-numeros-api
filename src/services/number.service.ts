import { numberRepo } from "../repositories/number.repo";
import { domainRepo } from "../repositories/domain.repo";
import { normalizePhone } from "../utils/normalizePhone";
import { badRequest, notFound } from "../utils/httpErrors";

export const numberService = {
  list() {
    return numberRepo.list();
  },

  async create(data: { name: string; phone: string }) {
    const name = data.name?.trim();
    const phone = normalizePhone(data.phone);

    if (!name) throw badRequest("Nome inválido");
    if (!phone) throw badRequest("Telefone inválido");

    return numberRepo.create({ name, phone });
  },

  async patch(id: string, data: { name?: string; phone?: string }) {
    const payload: { name?: string; phone?: string } = {};

    if (typeof data.name === "string") {
      const name = data.name.trim();
      if (!name) throw badRequest("Nome inválido");
      payload.name = name;
    }

    if (typeof data.phone === "string") {
      const phone = normalizePhone(data.phone);
      if (!phone) throw badRequest("Telefone inválido");
      payload.phone = phone;
    }

    const updated = await numberRepo.update(id, payload);
    if (!updated) throw notFound("Número não encontrado");
    return updated;
  },

  async remove(id: string) {
    const existing = await numberRepo.findById(id);
    if (!existing) throw notFound("Número não encontrado");

    await domainRepo.removeNumberFromAllDomains(id);

    const deleted = await numberRepo.delete(id);
    if (!deleted) throw notFound("Número não encontrado");

    return deleted;
  },
};