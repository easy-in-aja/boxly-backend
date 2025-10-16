const { Router } = require("express");
const ctrl = require("../controllers/PostController");
const auth = require("../middlewares/auth");
const v = require("../middlewares/validators/post.validation");

const router = Router();

router.post("/posts", auth, v.create, ctrl.create); // UC1
router.get("/posts/:postId", v.postIdParam, ctrl.getOne); // UC2 (auth optional)
router.put("/posts/:postId", auth, v.update, ctrl.update); // UC3 (owner only)
router.delete("/posts/:postId", auth, v.postIdParam, ctrl.remove); // UC4 (owner only)
router.get("/posts/user/:userId", v.userPostsQuery, ctrl.listByUser); // UC5

module.exports = router;
