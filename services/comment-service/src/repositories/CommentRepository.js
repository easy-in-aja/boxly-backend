const Comment = require("../models/Comment");
const { Types } = require("mongoose");

class CommentRepository {
  toId(id) {
    return new Types.ObjectId(id);
  }

  async create(data) {
    return Comment.create(data);
  }

  async findById(id) {
    return Comment.findById(id).lean(false);
  }

  async updateById(id, ownerId, payload) {
    return Comment.findOneAndUpdate({ _id: id, ownerId }, payload, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id, ownerId) {
    return Comment.deleteOne({ _id: id, ownerId });
  }

  async deleteChildrenOf(parentId) {
    return Comment.deleteMany({ parentCommentId: parentId });
  }

  async listByPost({ postId, page = 1, limit = 20, sort = "latest" }) {
    const skip = (page - 1) * limit;
    const order = sort === "oldest" ? 1 : -1;
    const filter = { postId };
    const [items, total] = await Promise.all([
      Comment.find(filter)
        .sort({ createdAt: order })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }
}

module.exports = CommentRepository;
