const { body, query, param, validationResult } = require("express-validator");

const handle = (req, res, next) => {
  const r = validationResult(req);
  if (!r.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: r.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const allowedTypes = ["post", "comment"];

const toggle = [
  body("targetType").isIn(allowedTypes),
  body("targetId").isMongoId(),
  handle,
];

const count = [
  query("targetType").isIn(allowedTypes),
  query("targetId").isMongoId(),
  handle,
];

const userLikes = [
  param("userId").isMongoId(),
  query("page").optional().toInt().isInt({ min: 1 }),
  query("limit").optional().toInt().isInt({ min: 1, max: 100 }),
  query("targetType").optional().isIn(allowedTypes),
  handle,
];

module.exports = { toggle, count, userLikes };
