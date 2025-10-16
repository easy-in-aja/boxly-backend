const { ok, created } = require("../utils/respond");
const ToggleLikeUseCase = require("../usecases/ToggleLikeUseCase");
const GetLikeCountUseCase = require("../usecases/GetLikeCountUseCase");
const GetUserLikesUseCase = require("../usecases/GetUserLikesUseCase");

module.exports = {
  async toggle(req, res, next) {
    try {
      const uc = new ToggleLikeUseCase();
      const data = await uc.execute({
        ownerId: req.user.id,
        targetType: req.body.targetType,
        targetId: req.body.targetId,
      });
      const msg = data.isLiked ? "Liked" : "Unliked";
      return created(res, data, msg);
    } catch (err) {
      next(err);
    }
  },

  async count(req, res, next) {
    try {
      const uc = new GetLikeCountUseCase();
      const data = await uc.execute({
        targetType: req.query.targetType,
        targetId: req.query.targetId,
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async userLikes(req, res, next) {
    try {
      const uc = new GetUserLikesUseCase();
      const data = await uc.execute({
        userId: req.params.userId,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
        targetType: req.query.targetType,
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },
};
