const { fail } = require("../utils/respond");
module.exports = (err, req, res, _next) => {
  console.error(err);
  if (err.status) return fail(res, err.status, err.message);
  return fail(res, 500, err.message || "Internal Server Error");
};
