const LikeRepository = require("../repositories/LikeRepository");

class GetUserLikesUseCase {
  constructor() {
    this.likes = new LikeRepository();
  }

  async execute({ userId, page = 1, limit = 20, targetType }) {
    const { items, total } = await this.likes.listByUser({
      ownerId: this.likes.toId(userId),
      page,
      limit,
      targetType,
    });

    return {
      likes: items.map((l) => ({
        likeId: String(l._id),
        targetType: l.targetType,
        targetId: String(l.targetId),
        createdAt: l.createdAt?.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = GetUserLikesUseCase;
