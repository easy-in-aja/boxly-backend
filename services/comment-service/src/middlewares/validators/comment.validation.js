const { body, param, query, validationResult } = require("express-validator");

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

const create = [
  body("postId").isMongoId(),
  body("content").isString().trim().isLength({ min: 1, max: 2000 }),
  body("parentCommentId").optional().isMongoId(),
  handle,
];

const commentIdParam = [param("commentId").isMongoId(), handle];

const list = [
  query("postId").isMongoId(),
  query("page").optional().toInt().isInt({ min: 1 }),
  query("limit").optional().toInt().isInt({ min: 1, max: 100 }),
  query("sort").optional().isIn(["latest", "oldest"]),
  handle,
];

const update = [
  param("commentId").isMongoId(),
  body("content").isString().trim().isLength({ min: 1, max: 2000 }),
  handle,
];

module.exports = { create, commentIdParam, list, update };
