const FollowRepository = require("../repositories/FollowRepository");

class ListFollowingUseCase {
  constructor() {
    this.follows = new FollowRepository();
  }

  async execute({
    targetUserId,
    requesterUserId,
    page = 1,
    limit = 20,
    search,
  }) {
    const targetId = this.follows.toId(targetUserId);
    const { edges, total } = await this.follows.followingOf(
      targetId,
      page,
      limit
    );
    const ids = edges.map((e) => e.followingId);
    let users = ids.length
      ? await require("../models/User")
          .find({ _id: { $in: ids } })
          .lean()
      : [];

    if (search) {
      const re = new RegExp(search, "i");
      users = users.filter(
        (u) => re.test(u.username) || re.test(u.fullName || "")
      );
    }

    let followingSet = new Set(),
      followedBySet = new Set();
    if (requesterUserId) {
      const reqId = this.follows.toId(requesterUserId);
      const [reqFollowing, reqFollowers] = await Promise.all([
        require("../models/Follow")
          .find(
            { followerId: reqId, followingId: { $in: ids } },
            { followingId: 1 }
          )
          .lean(),
        require("../models/Follow")
          .find(
            { followerId: { $in: ids }, followingId: reqId },
            { followerId: 1 }
          )
          .lean(),
      ]);
      followingSet = new Set(reqFollowing.map((d) => String(d.followingId)));
      followedBySet = new Set(reqFollowers.map((d) => String(d.followerId)));
    }

    const items = users.map((u) => ({
      userId: String(u._id),
      username: u.username,
      fullName: u.fullName,
      profilePicture: u.profilePicture,
      isFollowing: requesterUserId ? followingSet.has(String(u._id)) : false,
      isFollowedBy: requesterUserId ? followedBySet.has(String(u._id)) : false,
    }));

    return {
      users: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = ListFollowingUseCase;
