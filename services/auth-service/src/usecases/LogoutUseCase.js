const SessionRepository = require("../repositories/SessionRepository");
const crypto = require("crypto");

class LogoutUseCase {
  constructor() {
    this.sessions = new SessionRepository();
  }

  async execute(payload) {
    const { userId, refreshToken } = payload || {};
    if (refreshToken) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      const session = await this.sessions.findByTokenHash(tokenHash);
      if (session) await this.sessions.revokeById(session._id);
      return { revoked: !!session };
    }
    if (userId) {
      await this.sessions.revokeAllByUser(userId);
      return { revokedAll: true };
    }
    return { ok: true };
  }
}

module.exports = LogoutUseCase;
