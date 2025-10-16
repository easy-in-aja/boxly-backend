const PostRepository = require("../repositories/PostRepository");

class UpdatePostUseCase {
  constructor() {
    this.posts = new PostRepository();
  }

  async execute({ postId, ownerId, payload }) {
    const id = this.posts.toId(postId);
    const updated = await this.posts.updateById(
      id,
      payload,
      this.posts.toId(ownerId)
    );
    if (!updated) throw { status: 404, message: "Post not found or not owner" };
    return {
      postId: String(updated._id),
      ownerId: String(updated.ownerId),
      content: updated.content,
      images: updated.images || [],
      communityId: updated.communityId || null,
      isPublic: !!updated.isPublic,
      tags: updated.tags || [],
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    };
  }
}

module.exports = UpdatePostUseCase;
