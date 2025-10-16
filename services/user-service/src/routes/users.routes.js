const { Router } = require("express");
const ctrl = require("../controllers/UserController");
const auth = require("../middlewares/auth");
const v = require("../middlewares/validators/user.validation");

const router = Router();

// 🔎 UC5 – search users (harus paling atas biar gak ketabrak :userId)
router.get("/users/search", v.search, ctrl.search);

// 👥 UC4 – list followers / following
router.get(
  "/users/:userId/followers",
  v.userIdParam,
  v.pagination,
  ctrl.listFollowers
);
router.get(
  "/users/:userId/following",
  v.userIdParam,
  v.pagination,
  ctrl.listFollowing
);

// 👤 UC1 – lihat profil
router.get("/users/:userId", v.userIdParam, ctrl.getProfile);

// ✏️ UC2 – update profil (auth)
router.put("/users/:userId", auth, v.updateProfile, ctrl.updateProfile);

// ➕/➖ UC3 – follow / unfollow (auth)
router.post("/users/:userId/follow", auth, v.userIdParam, ctrl.follow);
router.delete("/users/:userId/follow", auth, v.userIdParam, ctrl.unfollow);

module.exports = router;
