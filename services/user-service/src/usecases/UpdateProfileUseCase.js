const UserRepository = require("../repositories/UserRepository");

class UpdateProfileUseCase {
  constructor() {
    this.users = new UserRepository();
  }

  async execute({ targetUserId, requesterUserId, payload }) {
    if (String(targetUserId) !== String(requesterUserId)) {
      throw { status: 403, message: "Forbidden" };
    }
    const allowed = [
      "username",
      "fullName",
      "bio",
      "profilePicture",
      "coverPicture",
      "isPrivate",
    ];
    const data = {};
    for (const k of allowed) if (payload[k] !== undefined) data[k] = payload[k];

    const updated = await this.users.updateById(targetUserId, data);
    if (!updated) throw { status: 404, message: "User not found" };

    return {
      userId: String(updated._id),
      username: updated.username,
      fullName: updated.fullName,
      bio: updated.bio,
      profilePicture: updated.profilePicture,
      coverPicture: updated.coverPicture,
      isPrivate: !!updated.isPrivate,
    };
  }
}

module.exports = UpdateProfileUseCase;
