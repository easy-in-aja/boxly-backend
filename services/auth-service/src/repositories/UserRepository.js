const User = require("../models/User");

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email }).lean(false);
  }
  async findByUsername(username) {
    return User.findOne({ username }).lean(false);
  }

  async create(data) {
    const u = new User(data);
    return u.save();
  }

  async findById(id) {
    return User.findById(id).lean(false);
  }
}

module.exports = UserRepository;
