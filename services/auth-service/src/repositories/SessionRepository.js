const Session = require("../models/Session");

class SessionRepository {
  async create(data) {
    const s = new Session(data);
    return s.save();
  }

  async findByTokenHash(tokenHash) {
    return Session.findOne({
      tokenHash,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async revokeById(id) {
    return Session.findByIdAndUpdate(id, { isRevoked: true }, { new: true });
  }

  async revokeAllByUser(userId) {
    return Session.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }
}

module.exports = SessionRepository;
