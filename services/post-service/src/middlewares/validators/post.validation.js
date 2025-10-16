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

const mongoId = (name = "id") => param(name).isMongoId();

const create = [
  body("content").isString().trim().isLength({ min: 1, max: 5000 }),
  body("images").optional().isArray({ max: 10 }),
  body("images.*").optional().isURL(),
  body("communityId").optional().isString().isLength({ max: 100 }), // fleksibel (uuid/string)
  body("isPublic").optional().isBoolean(),
  body("tags").optional().isArray({ max: 20 }),
  body("tags.*").optional().isString().trim().isLength({ min: 1, max: 50 }),
  handle,
];

const update = [
  mongoId("postId"),
  body("content").optional().isString().trim().isLength({ min: 1, max: 5000 }),
  body("images").optional().isArray({ max: 10 }),
  body("images.*").optional().isURL(),
  body("communityId").optional().isString().isLength({ max: 100 }),
  body("isPublic").optional().isBoolean(),
  body("tags").optional().isArray({ max: 20 }),
  body("tags.*").optional().isString().trim().isLength({ min: 1, max: 50 }),
  handle,
];

const postIdParam = [mongoId("postId"), handle];

const userPostsQuery = [
  param("userId").isMongoId(),
  query("page").optional().toInt().isInt({ min: 1 }),
  query("limit").optional().toInt().isInt({ min: 1, max: 100 }),
  handle,
];

module.exports = { create, update, postIdParam, userPostsQuery };
