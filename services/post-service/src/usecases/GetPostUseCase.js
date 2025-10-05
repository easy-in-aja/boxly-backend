const PostRepository = require("../repositories/PostRepository");

class GetPostUseCase {
  constructor() {
    this.posts = new PostRepository();
  }

  async execute({ postId, requesterId }) {
    const post = await this.posts.findById(this.posts.toId(postId));
    if (!post) throw { status: 404, message: "Post not found" };
    if (!post.isPublic && String(post.ownerId) !== String(requesterId || "")) {
      throw { status: 403, message: "Forbidden" };
    }
    return {
      postId: String(post._id),
      ownerId: String(post.ownerId),
      content: post.content,
      images: post.images || [],
      communityId: post.communityId || null,
      isPublic: !!post.isPublic,
      tags: post.tags || [],
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      isOwner: requesterId
        ? String(post.ownerId) === String(requesterId)
        : false,
    };
  }
}

module.exports = GetPostUseCase;
