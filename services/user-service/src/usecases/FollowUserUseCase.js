const FollowRepository = require("../repositories/FollowRepository");

class FollowUserUseCase {
  constructor() {
    this.follows = new FollowRepository();
  }

  async execute({ requesterUserId, targetUserId }) {
    if (String(requesterUserId) === String(targetUserId)) {
      throw { status: 400, message: "Cannot follow yourself" };
    }
    const followerId = this.follows.toId(requesterUserId);
    const followingId = this.follows.toId(targetUserId);

    // idempotent-ish: coba buat, kalau duplicate key abaikan
    try {
      await this.follows.follow(followerId, followingId);
    } catch (_) {}

    const { followerCount } = await this.follows.counts(followingId);

    return { isFollowing: true, followerCount };
  }
}

module.exports = FollowUserUseCase;
