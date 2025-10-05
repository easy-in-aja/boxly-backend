const { ok, created } = require("../utils/respond");

const RegisterUseCase = require("../usecases/RegisterUseCase");
const LoginUseCase = require("../usecases/LoginUseCase");
const RefreshUseCase = require("../usecases/RefreshUseCase");
const LogoutUseCase = require("../usecases/LogoutUseCase");

module.exports = {
  async register(req, res, next) {
    try {
      const uc = new RegisterUseCase();
      const data = await uc.execute(req.body);
      return created(res, data, "User registered successfully");
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const uc = new LoginUseCase();
      const ctx = { ip: req.ip, userAgent: req.headers["user-agent"] };
      const data = await uc.execute(req.body, ctx);
      return ok(res, data, "Login successful");
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const uc = new RefreshUseCase();
      const data = await uc.execute(req.body);
      return ok(res, data, "Token refreshed");
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const uc = new LogoutUseCase();
      const body = {
        userId: req.user?.id,
        refreshToken: req.body?.refreshToken,
      };
      const data = await uc.execute(body);
      return ok(res, data, "Logged out");
    } catch (err) {
      next(err);
    }
  },
};
