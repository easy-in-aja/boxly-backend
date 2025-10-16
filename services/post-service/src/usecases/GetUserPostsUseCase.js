const PostRepository = require("../repositories/PostRepository");

class GetUserPostsUseCase {
  constructor() {
    this.posts = new PostRepository();
  }

  async execute({ userId, page = 1, limit = 20, requesterId }) {
    const { items, total } = await this.posts.listByUser(
      this.posts.toId(userId),
      page,
      limit,
      requesterId
    );
    return {
      posts: items.map((p) => ({
        postId: String(p._id),
        ownerId: String(p.ownerId),
        content: p.content,
        images: p.images || [],
        communityId: p.communityId || null,
        isPublic: !!p.isPublic,
        tags: p.tags || [],
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
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

module.exports = GetUserPostsUseCase;
