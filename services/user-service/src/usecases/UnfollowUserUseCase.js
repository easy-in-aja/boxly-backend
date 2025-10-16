const FollowRepository = require("../repositories/FollowRepository");

class UnfollowUserUseCase {
  constructor() {
    this.follows = new FollowRepository();
  }

  async execute({ requesterUserId, targetUserId }) {
    const followerId = this.follows.toId(requesterUserId);
    const followingId = this.follows.toId(targetUserId);

    await this.follows.unfollow(followerId, followingId);
    const { followerCount } = await this.follows.counts(followingId);

    return { isFollowing: false, followerCount };
  }
}

module.exports = UnfollowUserUseCase;
