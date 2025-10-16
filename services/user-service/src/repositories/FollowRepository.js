const Follow = require("../models/Follow");
const { Types } = require("mongoose");

class FollowRepository {
  toId(id) {
    return new Types.ObjectId(id);
  }

  async follow(followerId, followingId) {
    return Follow.create({ followerId, followingId });
  }

  async unfollow(followerId, followingId) {
    return Follow.deleteOne({ followerId, followingId });
  }

  async isFollowing(followerId, followingId) {
    const count = await Follow.countDocuments({ followerId, followingId });
    return count > 0;
  }

  async followersOf(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [edges, total] = await Promise.all([
      Follow.find({ followingId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Follow.countDocuments({ followingId: userId }),
    ]);
    return { edges, total, page, limit };
  }

  async followingOf(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [edges, total] = await Promise.all([
      Follow.find({ followerId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Follow.countDocuments({ followerId: userId }),
    ]);
    return { edges, total, page, limit };
  }

  async counts(userId) {
    const [followerCount, followingCount] = await Promise.all([
      Follow.countDocuments({ followingId: userId }),
      Follow.countDocuments({ followerId: userId }),
    ]);
    return { followerCount, followingCount };
  }
}

module.exports = FollowRepository;
