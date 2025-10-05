const CommentRepository = require("../repositories/CommentRepository");

class UpdateCommentUseCase {
  constructor() {
    this.comments = new CommentRepository();
  }

  async execute({ commentId, ownerId, content }) {
    const updated = await this.comments.updateById(
      this.comments.toId(commentId),
      this.comments.toId(ownerId),
      { content }
    );
    if (!updated)
      throw { status: 404, message: "Comment not found or not owner" };

    return {
      commentId: String(updated._id),
      postId: String(updated.postId),
      ownerId: String(updated.ownerId),
      content: updated.content,
      parentCommentId: updated.parentCommentId
        ? String(updated.parentCommentId)
        : null,
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    };
  }
}

module.exports = UpdateCommentUseCase;
