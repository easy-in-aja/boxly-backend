const { Router } = require("express");
const ctrl = require("../controllers/LikeController");
const auth = require("../middlewares/auth");
const v = require("../middlewares/validators/like.validation");

const router = Router();

router.post("/likes/toggle", auth, v.toggle, ctrl.toggle); // UC1
router.get("/likes/count", v.count, ctrl.count); // UC2
router.get("/likes/user/:userId", v.userLikes, ctrl.userLikes); // UC3

module.exports = router;
