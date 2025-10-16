const CommentRepository = require("../repositories/CommentRepository");

class CreateCommentUseCase {
  constructor() {
    this.comments = new CommentRepository();
  }

  async execute({ ownerId, payload }) {
    const postId = this.comments.toId(payload.postId);
    let parentId = null;

    if (payload.parentCommentId) {
      const parent = await this.comments.findById(
        this.comments.toId(payload.parentCommentId)
      );
      if (!parent) throw { status: 400, message: "Parent comment not found" };
      if (String(parent.postId) !== String(postId)) {
        throw { status: 400, message: "Parent comment not in the same post" };
      }
      parentId = parent._id;
    }

    const doc = await this.comments.create({
      postId,
      ownerId: this.comments.toId(ownerId),
      content: payload.content,
      parentCommentId: parentId,
    });

    return this.serialize(doc);
  }

  serialize(c) {
    return {
      commentId: String(c._id),
      postId: String(c.postId),
      ownerId: String(c.ownerId),
      content: c.content,
      parentCommentId: c.parentCommentId ? String(c.parentCommentId) : null,
      createdAt: c.createdAt?.toISOString(),
      updatedAt: c.updatedAt?.toISOString(),
    };
  }
}

module.exports = CreateCommentUseCase;
