import mongoose, { InferSchemaType, Schema } from "mongoose";

const ClickEventSchema = new Schema(
  {
    numberId: {
      type: Schema.Types.ObjectId,
      ref: "Number",
      required: true,
      index: true,
    },

    domainId: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
      index: true,
    },

    // Preserva o histórico caso o número seja editado ou excluído.
    phoneSnapshot: {
      type: String,
      required: true,
      trim: true,
    },

    attendantNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },

    domainSnapshot: {
      type: String,
      required: true,
      trim: true,
    },

    // Informações calculadas no fuso de São Paulo.
    dateKey: {
      type: String,
      required: true,
      index: true,
    },

    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },

    weekKey: {
      type: String,
      required: true,
      index: true,
    },

    clickedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ClickEventSchema.index({
  dateKey: 1,
  hour: 1,
  numberId: 1,
});

ClickEventSchema.index({
  dateKey: 1,
  numberId: 1,
});

ClickEventSchema.index({
  weekKey: 1,
  numberId: 1,
});

ClickEventSchema.index({
  domainId: 1,
  clickedAt: -1,
});

export type ClickEventDoc = InferSchemaType<typeof ClickEventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ClickEventModel =
  mongoose.models.ClickEvent ||
  mongoose.model("ClickEvent", ClickEventSchema);