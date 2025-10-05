const CommentRepository = require("../repositories/CommentRepository");

class GetCommentsUseCase {
  constructor() {
    this.comments = new CommentRepository();
  }

  async execute({ postId, page = 1, limit = 20, sort = "latest" }) {
    const { items, total } = await this.comments.listByPost({
      postId: this.comments.toId(postId),
      page,
      limit,
      sort,
    });

    return {
      comments: items.map((c) => ({
        commentId: String(c._id),
        postId: String(c.postId),
        ownerId: String(c.ownerId),
        content: c.content,
        parentCommentId: c.parentCommentId ? String(c.parentCommentId) : null,
        createdAt: c.createdAt?.toISOString(),
        updatedAt: c.updatedAt?.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = GetCommentsUseCase;
