import { NumberModel } from "../models/Number";

export const numberRepo = {
  list() {
    return NumberModel.find().sort({ createdAt: -1 });
  },
  create(data: { name: string; phone: string }) {
    return NumberModel.create(data);
  },
  update(id: string, data: Partial<{ name: string; phone: string }>) {
    return NumberModel.findByIdAndUpdate(id, data, { new: true });
  },
  findById(id: string) {
    return NumberModel.findById(id);
  },
  delete(id: string) {
    return NumberModel.findByIdAndDelete(id);
  },
};
