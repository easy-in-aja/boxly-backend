const PostRepository = require("../repositories/PostRepository");

class DeletePostUseCase {
  constructor() {
    this.posts = new PostRepository();
  }

  async execute({ postId, ownerId }) {
    const id = this.posts.toId(postId);
    const result = await this.posts.deleteById(id, this.posts.toId(ownerId));
    if (!result.deletedCount)
      throw { status: 404, message: "Post not found or not owner" };
    return { deleted: true };
  }
}

module.exports = DeletePostUseCase;
