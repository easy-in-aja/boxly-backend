const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    tokenHash: { type: String, required: true, index: true }, // sha256(refreshToken)
    userAgent: { type: String },
    ip: { type: String },
    isRevoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL by Mongo

module.exports = mongoose.model("Session", SessionSchema);
