import mongoose, { Schema, InferSchemaType } from "mongoose";

const NumberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },  // atendente
    phone: { type: String, required: true, trim: true }, // só dígitos
  },
  { timestamps: true }
);

NumberSchema.index({ phone: 1 }, { unique: true });

export type NumberDoc = InferSchemaType<typeof NumberSchema> & { _id: mongoose.Types.ObjectId };

export const NumberModel =
  mongoose.models.Number || mongoose.model("Number", NumberSchema);
