const userController = require("../controller/userController");
const Router = require("express").Router;
const router = new Router();
const { body } = require("express-validator");
const authMiddleawre = require("../middlewares/authMiddleawre");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleawre, userController.getUsers);

module.exports = router;
