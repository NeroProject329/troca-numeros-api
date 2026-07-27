import mongoose, {
  InferSchemaType,
  Schema,
} from "mongoose";

export const SITE_MONITOR_STATUSES = [
  "unknown",
  "online",
  "offline",
] as const;

const SiteMonitorSchema = new Schema(
  {
    domainId: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
      unique: true,
      index: true,
    },

    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },

    status: {
      type: String,
      enum: SITE_MONITOR_STATUSES,
      default: "unknown",
      index: true,
    },

    lastHttpStatus: {
      type: Number,
      default: null,
    },

    lastResponseTimeMs: {
      type: Number,
      default: null,
    },

    consecutiveFailures: {
      type: Number,
      default: 0,
    },

    consecutiveSuccesses: {
      type: Number,
      default: 0,
    },

    lastCheckedAt: {
      type: Date,
      default: null,
    },

    lastOnlineAt: {
      type: Date,
      default: null,
    },

    lastOfflineAt: {
      type: Date,
      default: null,
    },

    offlineSince: {
      type: Date,
      default: null,
    },

    lastError: {
      type: String,
      default: null,
    },

    lastNotifiedDownAt: {
      type: Date,
      default: null,
    },

    lastNotifiedRecoveryAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,

    // IMPORTANTE:
    // precisa ser a mesma collection usada pelo worker.
    collection: "site_monitors",
  }
);

SiteMonitorSchema.index({
  enabled: 1,
  status: 1,
});

export type SiteMonitorDoc =
  InferSchemaType<
    typeof SiteMonitorSchema
  > & {
    _id: mongoose.Types.ObjectId;
  };

export const SiteMonitorModel =
  mongoose.models.SiteMonitor ||
  mongoose.model(
    "SiteMonitor",
    SiteMonitorSchema
  );