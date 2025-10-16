const { Router } = require("express");
const ctrl = require("../controllers/CommentController");
const auth = require("../middlewares/auth");
const v = require("../middlewares/validators/comment.validation");

const router = Router();

// UC1 – Create Comment (auth)
router.post("/comments", auth, v.create, ctrl.create);

// UC2 – Get Comments by postId (public)
router.get("/comments", v.list, ctrl.list);

// UC3 – Update Comment (owner + auth)
router.put("/comments/:commentId", auth, v.update, ctrl.update);

// UC4 – Delete Comment (owner + auth)
router.delete("/comments/:commentId", auth, v.commentIdParam, ctrl.remove);

module.exports = router;
