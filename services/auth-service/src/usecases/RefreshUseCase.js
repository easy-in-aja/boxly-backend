const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const SessionRepository = require("../repositories/SessionRepository");

class RefreshUseCase {
  constructor() {
    this.sessions = new SessionRepository();
  }

  async execute(payload) {
    const { refreshToken } = payload;
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await this.sessions.findByTokenHash(tokenHash);
    if (!session) throw { status: 401, message: "Invalid refresh token" };

    // issue new access token
    const accessToken = jwt.sign(
      { sub: String(session.userId) },
      process.env.JWT_SECRET,
      { expiresIn: Number(process.env.ACCESS_TOKEN_TTL || 3600) }
    );

    // rotate refresh token: revoke old & create new
    await this.sessions.revokeById(session._id);

    const newRefresh = crypto.randomBytes(64).toString("hex");
    const newHash = crypto
      .createHash("sha256")
      .update(newRefresh)
      .digest("hex");
    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.sessions.create({
      userId: session.userId,
      tokenHash: newHash,
      userAgent: "rotated",
      ip: undefined,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: newRefresh,
      expiresIn: Number(process.env.ACCESS_TOKEN_TTL || 3600),
    };
  }
}

module.exports = RefreshUseCase;
