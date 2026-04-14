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
    return DomainModel.create({
      domain: data.domain,
      isActive: true,
      numbers: [],
      activeNumberId: null,
    });
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

  async removeNumber(domainId: string, numberId: string) {
    const domain = await DomainModel.findById(domainId);
    if (!domain) return null;

    const currentActiveId = domain.activeNumberId
      ? String(domain.activeNumberId)
      : null;

    const update: Record<string, any> = {
      $pull: { numbers: numberId },
    };

    if (currentActiveId === String(numberId)) {
      update.$set = { activeNumberId: null };
    }

    return DomainModel.findByIdAndUpdate(domainId, update, { new: true });
  },

    setActiveNumber(domainId: string, numberId: string | null) {
    return DomainModel.findByIdAndUpdate(
      domainId,
      { $set: { activeNumberId: numberId } },
      { new: true }
    );
  },

  removeNumberFromAllDomains(numberId: string) {
    return DomainModel.updateMany(
      {
        $or: [
          { numbers: numberId },
          { activeNumberId: numberId },
        ],
      },
      {
        $pull: { numbers: numberId },
        $unset: { activeNumberId: "" },
      }
    );
  },
};