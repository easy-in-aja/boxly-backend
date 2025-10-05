const UserRepository = require("../repositories/UserRepository");
const FollowRepository = require("../repositories/FollowRepository");

class GetProfileUseCase {
  constructor() {
    this.users = new UserRepository();
    this.follows = new FollowRepository();
  }

  async execute({ targetUserId, requesterUserId }) {
    const user = await this.users.findById(targetUserId);
    if (!user) throw { status: 404, message: "User not found" };

    const { followerCount, followingCount } = await this.follows.counts(
      user._id
    );

    let isFollowing = false,
      isFollowedBy = false;
    if (requesterUserId) {
      isFollowing = await this.follows.isFollowing(
        this.follows.toId(requesterUserId),
        user._id
      );
      isFollowedBy = await this.follows.isFollowing(
        user._id,
        this.follows.toId(requesterUserId)
      );
    }

    return {
      userId: String(user._id),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      isVerified: !!user.isVerified,
      isPrivate: !!user.isPrivate,
      followerCount,
      followingCount,
      postCount: 0, // TODO: integrasi post-service
      joinedAt: user.createdAt?.toISOString(),
      ...(requesterUserId ? { isFollowing, isFollowedBy } : {}),
    };
  }
}

module.exports = GetProfileUseCase;
