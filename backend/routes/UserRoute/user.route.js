// import userController from "../controllers/userController"
const router = require("express").Router();
const userController = require("../../controllers/UserController/user.controller");
const { uploadImage } = require("../../utils/helper");
const db = require("../../models");
const authorize = require("../../middlewares/authorize");
const userService = require("../../services/UserService/user.service");
const passport = require("../../services/UserService/login-facebook.service");

router.post("/register", userController.registerAccount);
router.post("/login", userController.loginUser);
router.post(
  "/get-info",
  authorize(["director", "admin", "user"]),
  userController.getUserInfo
);
router.post(
  "/get-all",
  authorize(["director", "admin"]),
  userController.getAllUser
);
router.post(
  "/update",
  authorize(["director", "admin", "user"]),
  uploadImage("avatar").single("image"),
  userController.updateUser
);
router.post(
  "/delete",
  authorize(["director", "admin"]),
  userController.deleteUser
);
router.post("/check", userController.checkUser);

router.get(
  "/auth/facebook/callback",
  async function loginFacebook(req, res, next) {
    const user_id = parseInt(req.query.user_id);
    req.user_id = user_id;
    next();
  },
  //  passport.authenticate("facebook", {
  //   failureRedirect: "/login",
  //   session: false,
  // }),
  // function (req, res) {
  //   res.redirect("http://localhost:3000/link-accounts");
  // }
  async function authenticateFacebook(req, res, next) {
    const user_id = await req.user_id;
    await userService.loginFacebook(user_id).authenticate("facebook", {
      failureRedirect: "/login",
      successRedirect: 'http://localhost:3000/new-freelancer/link-accounts',
      session: false,
    },function(err, user, info){
      res.redirect('http://localhost:3000/new-freelancer/link-accounts');
    })(req,res,next)
  },
);
// router.post("/service/create", authorize('create') , userController.createServiceProfile)

module.exports = router;
