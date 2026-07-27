import { monitoringRepo } from "../repositories/monitoring.repo";

import {
  badRequest,
  notFound,
} from "../utils/httpErrors";

type MonitorStatus =
  | "unknown"
  | "online"
  | "offline"
  | "unstable";

function parseLimit(
  raw?: string
) {
  if (!raw) {
    return 50;
  }

  const value =
    Number(raw);

  if (
    !Number.isInteger(value) ||
    value < 1 ||
    value > 200
  ) {
    throw badRequest(
      "Limit inválido. Use um número inteiro entre 1 e 200."
    );
  }

  return value;
}

/*
 * O worker possui apenas:
 *
 * online
 * offline
 * unknown
 *
 * Mas no painel vamos criar
 * também o estado visual:
 *
 * unstable
 *
 * Exemplo:
 * ainda está ONLINE,
 * porém já falhou 1 ou 2 vezes.
 */
function getDisplayStatus(
  status: string,
  consecutiveFailures: number
): MonitorStatus {
  if (
    status !== "offline" &&
    consecutiveFailures > 0
  ) {
    return "unstable";
  }

  if (
    status === "online" ||
    status === "offline" ||
    status === "unknown"
  ) {
    return status;
  }

  return "unknown";
}

function statusPriority(
  status: MonitorStatus
) {
  if (status === "offline") {
    return 0;
  }

  if (status === "unstable") {
    return 1;
  }

  if (status === "unknown") {
    return 2;
  }

  return 3;
}

function serializeMonitor(
  monitor: any
) {
  const consecutiveFailures =
    Number(
      monitor.consecutiveFailures ??
        0
    );

  const consecutiveSuccesses =
    Number(
      monitor.consecutiveSuccesses ??
        0
    );

  const displayStatus =
    getDisplayStatus(
      String(
        monitor.status ??
          "unknown"
      ),

      consecutiveFailures
    );

  return {
    id:
      String(monitor._id),

    domainId:
      String(
        monitor.domainId
      ),

    domain:
      monitor.domain,

    url:
      monitor.url,

    enabled:
      Boolean(
        monitor.enabled
      ),

    /*
     * Status real salvo
     * pelo worker.
     */
    status:
      String(
        monitor.status ??
          "unknown"
      ),

    /*
     * Status que usaremos
     * visualmente no painel.
     */
    displayStatus,

    lastHttpStatus:
      monitor.lastHttpStatus ??
      null,

    lastResponseTimeMs:
      monitor.lastResponseTimeMs ??
      null,

    consecutiveFailures,

    consecutiveSuccesses,

    lastCheckedAt:
      monitor.lastCheckedAt ??
      null,

    lastOnlineAt:
      monitor.lastOnlineAt ??
      null,

    lastOfflineAt:
      monitor.lastOfflineAt ??
      null,

    offlineSince:
      monitor.offlineSince ??
      null,

    lastError:
      monitor.lastError ??
      null,

    lastNotifiedDownAt:
      monitor.lastNotifiedDownAt ??
      null,

    lastNotifiedRecoveryAt:
      monitor.lastNotifiedRecoveryAt ??
      null,

    createdAt:
      monitor.createdAt ??
      null,

    updatedAt:
      monitor.updatedAt ??
      null,
  };
}

function serializeIncident(
  incident: any
) {
  return {
    id:
      String(
        incident._id
      ),

    monitorId:
      String(
        incident.monitorId
      ),

    domainId:
      String(
        incident.domainId
      ),

    domain:
      incident.domain,

    startedAt:
      incident.startedAt,

    endedAt:
      incident.endedAt ??
      null,

    durationMs:
      incident.durationMs ??
      null,

    reason:
      incident.reason ??
      null,

    httpStatus:
      incident.httpStatus ??
      null,

    downNotifiedAt:
      incident.downNotifiedAt ??
      null,

    recoveryNotifiedAt:
      incident.recoveryNotifiedAt ??
      null,

    /*
     * endedAt === null
     * significa que o site
     * continua offline.
     */
    isOpen:
      !incident.endedAt,
  };
}

export const monitoringService = {
  async list() {
    const monitors =
      await monitoringRepo.list();

    const items =
      monitors
        .map(
          serializeMonitor
        )

        /*
         * Ordem:
         *
         * OFFLINE
         * INSTÁVEL
         * DESCONHECIDO
         * ONLINE
         */
        .sort((a, b) => {
          const priority =
            statusPriority(
              a.displayStatus
            ) -
            statusPriority(
              b.displayStatus
            );

          if (
            priority !== 0
          ) {
            return priority;
          }

          /*
           * Entre sites problemáticos,
           * mostra primeiro quem tem
           * mais falhas.
           */
          if (
            b.consecutiveFailures !==
            a.consecutiveFailures
          ) {
            return (
              b.consecutiveFailures -
              a.consecutiveFailures
            );
          }

          return (
            a.domain.localeCompare(
              b.domain,
              "pt-BR"
            )
          );
        });

    /*
     * Para os cards superiores
     * consideramos apenas os
     * monitores habilitados.
     */
    const enabledItems =
      items.filter(
        (item) =>
          item.enabled
      );

    const summary = {
      total:
        items.length,

      enabled:
        enabledItems.length,

      disabled:
        items.length -
        enabledItems.length,

      online:
        enabledItems.filter(
          (item) =>
            item.displayStatus ===
            "online"
        ).length,

      offline:
        enabledItems.filter(
          (item) =>
            item.displayStatus ===
            "offline"
        ).length,

      unstable:
        enabledItems.filter(
          (item) =>
            item.displayStatus ===
            "unstable"
        ).length,

      unknown:
        enabledItems.filter(
          (item) =>
            item.displayStatus ===
            "unknown"
        ).length,
    };

    return {
      summary,
      items,
    };
  },

  async detail(
    id: string
  ) {
    const monitor =
      await monitoringRepo
        .findById(id);

    if (!monitor) {
      throw notFound(
        "Monitor não encontrado"
      );
    }

    const [
      incidentCount,
      openIncident,
    ] = await Promise.all([
      monitoringRepo
        .countIncidents(id),

      monitoringRepo
        .findOpenIncident(id),
    ]);

    return {
      ...serializeMonitor(
        monitor
      ),

      incidentCount,

      /*
       * Caso esteja offline,
       * aqui teremos o incidente
       * atualmente aberto.
       */
      openIncident:
        openIncident
          ? serializeIncident(
              openIncident
            )
          : null,
    };
  },

  async incidents(
    id: string,
    rawLimit?: string
  ) {
    const monitor =
      await monitoringRepo
        .findById(id);

    if (!monitor) {
      throw notFound(
        "Monitor não encontrado"
      );
    }

    const limit =
      parseLimit(
        rawLimit
      );

    const [
      incidents,
      total,
    ] = await Promise.all([
      monitoringRepo
        .listIncidents(
          id,
          limit
        ),

      monitoringRepo
        .countIncidents(
          id
        ),
    ]);

    return {
      monitor: {
        id:
          String(
            monitor._id
          ),

        domain:
          monitor.domain,

        status:
          monitor.status,

        displayStatus:
          getDisplayStatus(
            String(
              monitor.status ??
                "unknown"
            ),

            Number(
              monitor
                .consecutiveFailures ??
                0
            )
          ),
      },

      total,
      limit,

      items:
        incidents.map(
          serializeIncident
        ),
    };
  },
};