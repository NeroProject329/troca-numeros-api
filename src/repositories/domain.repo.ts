import { DomainModel } from "../models/Domain";

export const domainRepo = {
  list() {
    return DomainModel.find().sort({ createdAt: -1 });
  },
  listActiveForDashboard() {
    return DomainModel.find({ isActive: true })
      .populate("activeNumberId")
      .sort({ createdAt: -1 });
  },
  create(data: { domain: string }) {
    return DomainModel.create({ domain: data.domain, isActive: true, numbers: [], activeNumberId: null });
  },
  findById(id: string) {
    return DomainModel.findById(id).populate("numbers").populate("activeNumberId");
  },
  findByDomain(domain: string) {
    return DomainModel.findOne({ domain }).populate("activeNumberId");
  },
  patch(id: string, data: Partial<{ isActive: boolean }>) {
    return DomainModel.findByIdAndUpdate(id, data, { new: true });
  },
  addNumber(domainId: string, numberId: string) {
    return DomainModel.findByIdAndUpdate(
      domainId,
      { $addToSet: { numbers: numberId } },
      { new: true }
    );
  },
  removeNumber(domainId: string, numberId: string) {
    return DomainModel.findByIdAndUpdate(
      domainId,
      { $pull: { numbers: numberId }, $set: { activeNumberId: null } },
      { new: true }
    );
  },
  setActiveNumber(domainId: string, numberId: string | null) {
    return DomainModel.findByIdAndUpdate(
      domainId,
      { $set: { activeNumberId: numberId } },
      { new: true }
    );
  },
};
