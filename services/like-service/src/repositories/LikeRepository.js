const Like = require("../models/Like");
const { Types } = require("mongoose");

class LikeRepository {
  toId(id) {
    return new Types.ObjectId(id);
  }

  async create({ ownerId, targetType, targetId }) {
    return Like.create({ ownerId, targetType, targetId });
  }

  async findOne({ ownerId, targetType, targetId }) {
    return Like.findOne({ ownerId, targetType, targetId }).lean(false);
  }

  async delete({ ownerId, targetType, targetId }) {
    return Like.deleteOne({ ownerId, targetType, targetId });
  }

  async count({ targetType, targetId }) {
    return Like.countDocuments({ targetType, targetId });
  }

  async listByUser({ ownerId, page = 1, limit = 20, targetType }) {
    const skip = (page - 1) * limit;
    const filter = { ownerId };
    if (targetType) filter.targetType = targetType;

    const [items, total] = await Promise.all([
      Like.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Like.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }
}

module.exports = LikeRepository;
