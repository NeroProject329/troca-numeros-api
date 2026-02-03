import { domainRepo } from "../repositories/domain.repo";
import { normalizeDomain } from "../utils/normalizeDomain";
import { notFound } from "../utils/httpErrors";

export const zapService = {
  async getZapByDomain(rawDomain: string) {
    const domain = normalizeDomain(rawDomain);
    if (!domain) throw notFound("Domínio inválido");

    const doc = await domainRepo.findByDomain(domain);
    if (!doc) throw notFound("Domínio não encontrado");
    if (!doc.isActive) throw notFound("Domínio inativo");
    if (!doc.activeNumberId) throw notFound("Domínio sem número ativo");

    const n: any = doc.activeNumberId;

    return {
      domain: doc.domain,
      phone: n.phone,
      attendantName: n.name,
    };
  },
};
