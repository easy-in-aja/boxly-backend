const Post = require("../models/Post");
const { Types } = require("mongoose");

class PostRepository {
  toId(id) {
    return new Types.ObjectId(id);
  }

  async create(data) {
    return Post.create(data);
  }

  async findById(id) {
    return Post.findById(id).lean(false);
  }

  async updateById(id, payload, ownerId) {
    return Post.findOneAndUpdate({ _id: id, ownerId }, payload, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id, ownerId) {
    return Post.deleteOne({ _id: id, ownerId });
  }

  async listByUser(userId, page = 1, limit = 20, requesterId = null) {
    const filter = { ownerId: userId };
    if (!requesterId || String(requesterId) !== String(userId)) {
      filter.isPublic = true;
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }
}

module.exports = PostRepository;
