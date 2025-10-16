const UserRepository = require("../repositories/UserRepository");

class SearchUsersUseCase {
  constructor() {
    this.users = new UserRepository();
  }

  async execute({ q = "", page = 1, limit = 20 }) {
    const { items, pagination } = await this.users.search(q, page, limit);
    return {
      users: items.map((u) => ({
        userId: String(u._id),
        username: u.username,
        fullName: u.fullName,
        profilePicture: u.profilePicture,
      })),
      pagination,
    };
  }
}

module.exports = SearchUsersUseCase;
