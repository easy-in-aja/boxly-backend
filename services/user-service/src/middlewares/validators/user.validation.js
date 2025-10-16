const { param, query, body, validationResult } = require("express-validator");

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

const userIdParam = [param("userId").isMongoId(), handle];

const updateProfile = [
  param("userId").isMongoId(),
  body("username").optional().isString().trim().isLength({ min: 3, max: 30 }),
  body("fullName").optional().isString().trim().isLength({ min: 1, max: 80 }),
  body("bio").optional().isString().isLength({ max: 200 }),
  body("profilePicture").optional().isURL(),
  body("coverPicture").optional().isURL(),
  body("isPrivate").optional().isBoolean(),
  handle,
];

const pagination = [
  query("page").optional().toInt().isInt({ min: 1 }),
  query("limit").optional().toInt().isInt({ min: 1, max: 100 }),
  query("search").optional().isString().trim(),
  handle,
];

const search = [
  query("q").optional().isString().trim(),
  query("page").optional().toInt().isInt({ min: 1 }),
  query("limit").optional().toInt().isInt({ min: 1, max: 100 }),
  handle,
];

module.exports = { userIdParam, updateProfile, pagination, search };
