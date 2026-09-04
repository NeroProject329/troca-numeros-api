import { DomainModel } from "../models/Domain";
import { Types } from "mongoose";

export const domainRepo = {
  list() {
    return DomainModel.find().sort({ createdAt: -1 });
  },

  listActiveForDashboard() {
    return DomainModel.find({ isActive: true })
      .select("domain isActive activeNumberId createdAt updatedAt")
      .populate("activeNumberId", "name phone")
      .sort({ createdAt: -1 })
      .lean();
  },

  create(data: { domain: string; numbers?: Types.ObjectId[] }) {
    return DomainModel.create({
      domain: data.domain,
      isActive: true,
      numbers: data.numbers ?? [],
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
    const id = new Types.ObjectId(numberId);
    return DomainModel.updateMany(
      {
        $or: [
          { numbers: numberId },
          { activeNumberId: numberId },
        ],
      },
      [{ $set: {
        numbers: { $filter: { input: { $ifNull: ["$numbers", []] }, as: "number", cond: { $ne: ["$$number", id] } } },
        activeNumberId: { $cond: [{ $eq: ["$activeNumberId", id] }, null, { $ifNull: ["$activeNumberId", null] }] },
      } }],
      { updatePipeline: true }
    );
  },
};
