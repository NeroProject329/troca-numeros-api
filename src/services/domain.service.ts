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

  // ✅ detalhe do domínio: números vinculados + domínios onde cada número está ativo
  async getDetail(id: string) {
    const domain = await domainRepo.findById(id);
    if (!domain) throw notFound("Domínio não encontrado");

    // IDs dos números vinculados
    const numberIds = (domain.numbers as any[]).map((n) => String(n._id));

    // busca todos domínios que estão com activeNumberId em algum desses números
    const activeDomains = await DomainModel.find({
      activeNumberId: { $in: numberIds.map((x) => new mongoose.Types.ObjectId(x)) },
    }).select({ domain: 1, activeNumberId: 1 });

    // monta map: numberId -> [{id, domain}]
    const map = new Map<string, Array<{ id: string; domain: string }>>();
    for (const d of activeDomains) {
      const nId = String(d.activeNumberId);
      const arr = map.get(nId) ?? [];
      arr.push({ id: String(d._id), domain: d.domain });
      map.set(nId, arr);
    }

    const numbers = (domain.numbers as any[]).map((n) => {
      const activeInDomains = map.get(String(n._id)) ?? [];
      return {
        id: String(n._id),
        name: n.name,
        phone: n.phone,
        isActiveHere: domain.activeNumberId ? String(domain.activeNumberId?._id ?? domain.activeNumberId) === String(n._id) : false,
        activeInDomains, // inclui outros domínios onde ele está ativo
      };
    });

    return {
      id: String(domain._id),
      domain: domain.domain,
      isActive: domain.isActive,
      activeNumberId: domain.activeNumberId ? String((domain.activeNumberId as any)._id ?? domain.activeNumberId) : null,
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
    // se setar um número, valida se ele está vinculado ao domínio
    if (numberId) {
      const domain = await domainRepo.findById(domainId);
      if (!domain) throw notFound("Domínio não encontrado");

      const linkedIds = (domain.numbers as any[]).map((n) => String(n._id));
      if (!linkedIds.includes(String(numberId))) {
        throw badRequest("Esse número não está vinculado a este domínio");
      }
    }

    const updated = await domainRepo.setActiveNumber(domainId, numberId);
    if (!updated) throw notFound("Domínio não encontrado");
    return updated;
  },
};
