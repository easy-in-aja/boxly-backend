const { ok, created } = require("../utils/respond");
const CreatePostUseCase = require("../usecases/CreatePostUseCase");
const GetPostUseCase = require("../usecases/GetPostUseCase");
const UpdatePostUseCase = require("../usecases/UpdatePostUseCase");
const DeletePostUseCase = require("../usecases/DeletePostUseCase");
const GetUserPostsUseCase = require("../usecases/GetUserPostsUseCase");

module.exports = {
  async create(req, res, next) {
    try {
      const uc = new CreatePostUseCase();
      const data = await uc.execute({
        ownerId: req.user.id,
        payload: req.body,
      });
      return created(res, data, "Post created");
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const uc = new GetPostUseCase();
      const data = await uc.execute({
        postId: req.params.postId,
        requesterId: req.user?.id,
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const uc = new UpdatePostUseCase();
      const data = await uc.execute({
        postId: req.params.postId,
        ownerId: req.user.id,
        payload: req.body,
      });
      return ok(res, data, "Post updated");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const uc = new DeletePostUseCase();
      const data = await uc.execute({
        postId: req.params.postId,
        ownerId: req.user.id,
      });
      return ok(res, data, "Post deleted");
    } catch (err) {
      next(err);
    }
  },

  async listByUser(req, res, next) {
    try {
      const uc = new GetUserPostsUseCase();
      const data = await uc.execute({
        userId: req.params.userId,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
        requesterId: req.user?.id,
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },
};
