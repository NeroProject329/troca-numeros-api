import mongoose, { Schema, InferSchemaType } from "mongoose";

const DomainSchema = new Schema(
  {
    domain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },

    numbers: [{ type: Schema.Types.ObjectId, ref: "Number" }],
    activeNumberId: { type: Schema.Types.ObjectId, ref: "Number", default: null },
  },
  { timestamps: true }
);

export type DomainDoc = InferSchemaType<typeof DomainSchema> & { _id: mongoose.Types.ObjectId };

export const DomainModel =
  mongoose.models.Domain || mongoose.model("Domain", DomainSchema);
