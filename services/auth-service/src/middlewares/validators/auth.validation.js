const { body, validationResult } = require("express-validator");

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

const register = [
  body("username").isString().trim().isLength({ min: 3, max: 30 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("confirmPassword")
    .custom((v, { req }) => v === req.body.password)
    .withMessage("passwords must match"),
  body("fullName").isString().trim().isLength({ min: 1, max: 80 }),
  body("dateOfBirth").optional().isISO8601(),
  handle,
];

const login = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  handle,
];

const refresh = [body("refreshToken").isString().notEmpty(), handle];

module.exports = { register, login, refresh };
