import mongoose, {
  InferSchemaType,
  Schema,
} from "mongoose";

const SiteIncidentSchema = new Schema(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: "SiteMonitor",
      required: true,
      index: true,
    },

    domainId: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
      index: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
    },

    startedAt: {
      type: Date,
      required: true,
      index: true,
    },

    endedAt: {
      type: Date,
      default: null,
      index: true,
    },

    durationMs: {
      type: Number,
      default: null,
    },

    reason: {
      type: String,
      default: null,
    },

    httpStatus: {
      type: Number,
      default: null,
    },

    downNotifiedAt: {
      type: Date,
      default: null,
    },

    recoveryNotifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,

    // Mesma collection criada pelo worker.
    collection: "site_incidents",
  }
);

SiteIncidentSchema.index({
  monitorId: 1,
  startedAt: -1,
});

export type SiteIncidentDoc =
  InferSchemaType<
    typeof SiteIncidentSchema
  > & {
    _id: mongoose.Types.ObjectId;
  };

export const SiteIncidentModel =
  mongoose.models.SiteIncident ||
  mongoose.model(
    "SiteIncident",
    SiteIncidentSchema
  );