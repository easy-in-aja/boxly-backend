const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Satu user hanya boleh like sekali per target
LikeSchema.index({ ownerId: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
