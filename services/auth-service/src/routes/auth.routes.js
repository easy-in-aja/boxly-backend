const { Router } = require("express");
const ctrl = require("../controllers/AuthController");
const auth = require("../middlewares/auth");
const v = require("../middlewares/validators/auth.validation");

const router = Router();

router.post("/register", v.register, ctrl.register); // UC1
router.post("/login", v.login, ctrl.login); // UC2
router.post("/refresh", v.refresh, ctrl.refresh); // UC3
router.post("/logout", auth, ctrl.logout); // UC4

module.exports = router;
