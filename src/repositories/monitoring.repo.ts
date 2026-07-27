import mongoose from "mongoose";

import { SiteMonitorModel } from "../models/SiteMonitor";

import { SiteIncidentModel } from "../models/SiteIncident";

export const monitoringRepo = {
  list() {
    return SiteMonitorModel.find()
      .sort({
        status: 1,
        consecutiveFailures: -1,
        domain: 1,
      })
      .lean();
  },

  findById(id: string) {
    if (
      !mongoose.isValidObjectId(id)
    ) {
      return null;
    }

    return SiteMonitorModel
      .findById(id)
      .lean();
  },

  listIncidents(
    monitorId: string,
    limit: number
  ) {
    return SiteIncidentModel.find({
      monitorId,
    })
      .sort({
        startedAt: -1,
      })
      .limit(limit)
      .lean();
  },

  countIncidents(
    monitorId: string
  ) {
    return SiteIncidentModel
      .countDocuments({
        monitorId,
      });
  },

  findOpenIncident(
    monitorId: string
  ) {
    return SiteIncidentModel
      .findOne({
        monitorId,
        endedAt: null,
      })
      .sort({
        startedAt: -1,
      })
      .lean();
  },
};