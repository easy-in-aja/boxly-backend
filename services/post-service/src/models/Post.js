const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String, required: true, maxlength: 5000 },
    images: [{ type: String }],
    communityId: { type: String }, // fleksibel, tidak wajib ObjectId
    isPublic: { type: Boolean, default: true, index: true },
    tags: [{ type: String, index: true }],
  },
  { timestamps: true }
);

PostSchema.index({ ownerId: 1, createdAt: -1 });

module.exports = mongoose.model("Post", PostSchema);
