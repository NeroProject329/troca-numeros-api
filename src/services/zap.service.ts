import { domainRepo } from "../repositories/domain.repo";
import { clickEventRepo } from "../repositories/clickEvent.repo";

import { normalizeDomain } from "../utils/normalizeDomain";
import { notFound } from "../utils/httpErrors";
import { getMetricsDateParts } from "../utils/metricsDate";

export const zapService = {
  async getZapByDomain(
    rawDomain: string
  ) {
    const domain =
      normalizeDomain(rawDomain);

    if (!domain) {
      throw notFound(
        "Domínio inválido"
      );
    }

    const doc =
      await domainRepo.findByDomain(
        domain
      );

    if (!doc) {
      throw notFound(
        "Domínio não encontrado"
      );
    }

    if (!doc.isActive) {
      throw notFound(
        "Domínio inativo"
      );
    }

    if (!doc.activeNumberId) {
      throw notFound(
        "Domínio sem número ativo"
      );
    }

    const number: any =
      doc.activeNumberId;

    const clickedAt = new Date();

    const {
      dateKey,
      hour,
      weekKey,
    } = getMetricsDateParts(
      clickedAt
    );

    /*
     * O registro da métrica nunca
     * pode impedir o WhatsApp de abrir.
     */
    try {
      await clickEventRepo.create({
        numberId: String(
          number._id
        ),

        domainId: String(
          doc._id
        ),

        phoneSnapshot:
          number.phone,

        attendantNameSnapshot:
          number.name,

        domainSnapshot:
          doc.domain,

        dateKey,
        hour,
        weekKey,
        clickedAt,
      });
    } catch (error) {
      console.error(
        "[METRICS] Não foi possível registrar o clique:",
        error
      );
    }

    return {
      domain: doc.domain,
      phone: number.phone,
      attendantName: number.name,
    };
  },
};