import mongoose from "mongoose";
import { domainRepo } from "../repositories/domain.repo";
import { numberRepo } from "../repositories/number.repo";
import { normalizeDomain } from "../utils/normalizeDomain";
import { badRequest, notFound } from "../utils/httpErrors";
import { DomainModel } from "../models/Domain";

export const domainService = {
  list() {
    return domainRepo.list();
  },

  listDashboardActive() {
    return domainRepo.listActiveForDashboard();
  },

  async create(data: { domain: string }) {
    const domain = normalizeDomain(data.domain);
    if (!domain) throw badRequest("Domínio inválido");
    return domainRepo.create({ domain });
  },

  async patch(id: string, data: { isActive?: boolean }) {
    const updated = await domainRepo.patch(id, data);
    if (!updated) throw notFound("Domínio não encontrado");
    return updated;
  },

  async getDetail(id: string) {
    const domain = await domainRepo.findById(id);
    if (!domain) throw notFound("Domínio não encontrado");

    const numberIds = (domain.numbers as any[]).map((n) => String(n._id));

    const activeDomains =
      numberIds.length > 0
        ? await DomainModel.find({
            activeNumberId: {
              $in: numberIds.map((x) => new mongoose.Types.ObjectId(x)),
            },
          }).select({ domain: 1, activeNumberId: 1 })
        : [];

    const map = new Map<string, Array<{ id: string; domain: string }>>();

    for (const d of activeDomains) {
      const nId = String(d.activeNumberId);
      const arr = map.get(nId) ?? [];
      arr.push({
        id: String(d._id),
        domain: d.domain,
      });
      map.set(nId, arr);
    }

    const currentActiveId = domain.activeNumberId
      ? String((domain.activeNumberId as any)._id ?? domain.activeNumberId)
      : null;

    const numbers = (domain.numbers as any[]).map((n) => {
      const nId = String(n._id);

      return {
        id: nId,
        name: n.name,
        phone: n.phone,
        isActiveHere: currentActiveId === nId,
        activeInDomains: map.get(nId) ?? [],
      };
    });

    return {
      id: String(domain._id),
      domain: domain.domain,
      isActive: domain.isActive,
      activeNumberId: currentActiveId,
      numbers,
    };
  },

  async linkNumber(domainId: string, numberId: string) {
    const number = await numberRepo.findById(numberId);
    if (!number) throw notFound("Número não encontrado");

    const updated = await domainRepo.addNumber(domainId, numberId);
    if (!updated) throw notFound("Domínio não encontrado");

    return updated;
  },

  async unlinkNumber(domainId: string, numberId: string) {
    const updated = await domainRepo.removeNumber(domainId, numberId);
    if (!updated) throw notFound("Domínio não encontrado");

    return updated;
  },

  async setActiveNumber(domainId: string, numberId: string | null) {
    const domain = await domainRepo.findById(domainId);
    if (!domain) throw notFound("Domínio não encontrado");

    if (numberId === null) {
      const updated = await domainRepo.setActiveNumber(domainId, null);
      if (!updated) throw notFound("Domínio não encontrado");
      return updated;
    }

    const linkedIds = (domain.numbers as any[]).map((n) => String(n._id));

    if (!linkedIds.includes(String(numberId))) {
      throw badRequest("Esse número não está vinculado a este domínio");
    }

    // importante:
    // aqui a ativação vale somente para este domínio.
    // o mesmo número pode continuar ativo em outros domínios também.
    const updated = await domainRepo.setActiveNumber(domainId, numberId);
    if (!updated) throw notFound("Domínio não encontrado");

    return updated;
  },
};