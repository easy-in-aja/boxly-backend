const { ok, created } = require("../utils/respond");
const GetProfileUseCase = require("../usecases/GetProfileUseCase");
const UpdateProfileUseCase = require("../usecases/UpdateProfileUseCase");
const FollowUserUseCase = require("../usecases/FollowUserUseCase");
const UnfollowUserUseCase = require("../usecases/UnfollowUserUseCase");
const ListFollowersUseCase = require("../usecases/ListFollowersUseCase");
const ListFollowingUseCase = require("../usecases/ListFollowingUseCase");
const SearchUsersUseCase = require("../usecases/SearchUsersUseCase");

module.exports = {
  async getProfile(req, res, next) {
    try {
      const uc = new GetProfileUseCase();
      const data = await uc.execute({
        targetUserId: req.params.userId,
        requesterUserId: req.user?.id,
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const uc = new UpdateProfileUseCase();
      const data = await uc.execute({
        targetUserId: req.params.userId,
        requesterUserId: req.user?.id,
        payload: req.body,
      });
      return ok(res, data, "Profile updated");
    } catch (err) {
      next(err);
    }
  },

  async follow(req, res, next) {
    try {
      const uc = new FollowUserUseCase();
      const data = await uc.execute({
        requesterUserId: req.user.id,
        targetUserId: req.params.userId,
      });
      return created(res, data, "Successfully followed user");
    } catch (err) {
      next(err);
    }
  },

  async unfollow(req, res, next) {
    try {
      const uc = new UnfollowUserUseCase();
      const data = await uc.execute({
        requesterUserId: req.user.id,
        targetUserId: req.params.userId,
      });
      return ok(res, data, "Successfully unfollowed user");
    } catch (err) {
      next(err);
    }
  },

  async listFollowers(req, res, next) {
    try {
      const uc = new ListFollowersUseCase();
      const data = await uc.execute({
        targetUserId: req.params.userId,
        requesterUserId: req.user?.id,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
        search: req.query.search,
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async listFollowing(req, res, next) {
    try {
      const uc = new ListFollowingUseCase();
      const data = await uc.execute({
        targetUserId: req.params.userId,
        requesterUserId: req.user?.id,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
        search: req.query.search,
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async search(req, res, next) {
    try {
      const uc = new SearchUsersUseCase();
      const data = await uc.execute({
        q: req.query.q || "",
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },
};
