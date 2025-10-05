const CommentRepository = require("../repositories/CommentRepository");

class DeleteCommentUseCase {
  constructor() {
    this.comments = new CommentRepository();
  }

  async execute({ commentId, ownerId }) {
    const id = this.comments.toId(commentId);

    // hapus anak level-1 (TODO: deep cascade jika perlu)
    await this.comments.deleteChildrenOf(id);

    const result = await this.comments.deleteById(
      id,
      this.comments.toId(ownerId)
    );
    if (!result.deletedCount)
      throw { status: 404, message: "Comment not found or not owner" };

    return { deleted: true };
  }
}

module.exports = DeleteCommentUseCase;
