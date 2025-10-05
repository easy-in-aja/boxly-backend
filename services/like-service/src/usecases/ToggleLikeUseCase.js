const LikeRepository = require("../repositories/LikeRepository");

class ToggleLikeUseCase {
  constructor() {
    this.likes = new LikeRepository();
  }

  async execute({ ownerId, targetType, targetId }) {
    const oId = this.likes.toId(ownerId);
    const tId = this.likes.toId(targetId);

    // toggle: kalau sudah ada → hapus; kalau belum → buat
    const existing = await this.likes.findOne({
      ownerId: oId,
      targetType,
      targetId: tId,
    });
    let isLiked;
    if (existing) {
      await this.likes.delete({ ownerId: oId, targetType, targetId: tId });
      isLiked = false;
    } else {
      try {
        await this.likes.create({ ownerId: oId, targetType, targetId: tId });
      } catch (_) {} // idempotent jika race
      isLiked = true;
    }
    const likeCount = await this.likes.count({ targetType, targetId: tId });

    return { isLiked, likeCount };
  }
}

module.exports = ToggleLikeUseCase;
