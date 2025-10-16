const PostRepository = require("../repositories/PostRepository");

class CreatePostUseCase {
  constructor() {
    this.posts = new PostRepository();
  }

  async execute({ ownerId, payload }) {
    const doc = await this.posts.create({
      ownerId: this.posts.toId(ownerId),
      content: payload.content,
      images: payload.images || [],
      communityId: payload.communityId,
      isPublic: payload.isPublic !== undefined ? !!payload.isPublic : true,
      tags: payload.tags || [],
    });
    return this.serialize(doc);
  }

  serialize(p) {
    return {
      postId: String(p._id),
      ownerId: String(p.ownerId),
      content: p.content,
      images: p.images || [],
      communityId: p.communityId || null,
      isPublic: !!p.isPublic,
      tags: p.tags || [],
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    };
  }
}

module.exports = CreatePostUseCase;
