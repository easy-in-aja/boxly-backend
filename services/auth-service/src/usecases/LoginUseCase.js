const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserRepository = require("../repositories/UserRepository");
const SessionRepository = require("../repositories/SessionRepository");

class LoginUseCase {
  constructor() {
    this.users = new UserRepository();
    this.sessions = new SessionRepository();
  }

  async execute(payload, ctx = {}) {
    const { email, password } = payload;
    const user = await this.users.findByEmail(email);
    if (!user) throw { status: 401, message: "Invalid credentials" };

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw { status: 401, message: "Invalid credentials" };

    const accessToken = jwt.sign(
      { sub: String(user._id), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: Number(process.env.ACCESS_TOKEN_TTL || 3600) }
    );

    // refresh token random & hash disimpan
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.sessions.create({
      userId: user._id,
      tokenHash,
      userAgent: ctx.userAgent,
      ip: ctx.ip,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: Number(process.env.ACCESS_TOKEN_TTL || 3600),
      user: {
        userId: String(user._id),
        username: user.username,
        email: user.email,
      },
    };
  }
}

module.exports = LoginUseCase;
