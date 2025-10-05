const LikeRepository = require("../repositories/LikeRepository");

class GetLikeCountUseCase {
  constructor() {
    this.likes = new LikeRepository();
  }

  async execute({ targetType, targetId }) {
    const count = await this.likes.count({
      targetType,
      targetId: this.likes.toId(targetId),
    });
    return { likeCount: count };
  }
}

module.exports = GetLikeCountUseCase;
