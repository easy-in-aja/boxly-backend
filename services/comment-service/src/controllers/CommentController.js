const { ok, created } = require("../utils/respond");
const CreateCommentUseCase = require("../usecases/CreateCommentUseCase");
const GetCommentsUseCase = require("../usecases/GetCommentsUseCase");
const UpdateCommentUseCase = require("../usecases/UpdateCommentUseCase");
const DeleteCommentUseCase = require("../usecases/DeleteCommentUseCase");

module.exports = {
  async create(req, res, next) {
    try {
      const uc = new CreateCommentUseCase();
      const data = await uc.execute({
        ownerId: req.user.id,
        payload: req.body,
      });
      return created(res, data, "Comment created");
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const uc = new GetCommentsUseCase();
      const data = await uc.execute({
        postId: req.query.postId,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
        sort: req.query.sort || "latest",
      });
      return ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const uc = new UpdateCommentUseCase();
      const data = await uc.execute({
        commentId: req.params.commentId,
        ownerId: req.user.id,
        content: req.body.content,
      });
      return ok(res, data, "Comment updated");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const uc = new DeleteCommentUseCase();
      const data = await uc.execute({
        commentId: req.params.commentId,
        ownerId: req.user.id,
      });
      return ok(res, data, "Comment deleted");
    } catch (err) {
      next(err);
    }
  },
};
