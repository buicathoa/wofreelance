// import userController from "../controllers/userController"
const router = require("express").Router();
const userController = require("../../controllers/UserController/user.controller");
const db = require("../../models");
const authorize = require("../../middlewares/authorize");
const userService = require("../../services/UserService/user.service");
const { uploadImage } = require("../../utils/helper");
const {io} = require("../../server")
const jwt = require("jsonwebtoken");
const store = require('store');

router.post("/register", userController.registerAccount);
router.post("/login", userController.loginUser);
router.post(
  "/get-info",
  // authorize(["director", "admin", "user"]),
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
  uploadImage("avatar").single('avatar'),
  // userController.updateUser
   async (req, res) => {
    userController.updateUser(req, res)
  }
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
    let user_id;
    if(req.query.user_id) {
      user_id = parseInt(req.query.user_id);
    } else {
      user_id = null
    }
    req.user_id = user_id;
    next();
  },
  async function authenticateFacebook(req, res, next) {
    const user_id = await req.user_id;
    await userService.loginFacebook(user_id, res).authenticate("facebook", {
      failureRedirect: "/login",
      successRedirect: 'http://localhost:3000/new-freelancer/link-accounts',
      // session: false,
      scope:['email']
    },function(user){
      if(!user_id) {
        if(!user.isNewRecord){
          res.redirect('http://localhost:3000/dashboard')
        } else {
          res.redirect('http://localhost:3000/signup?step=2')
        }
      } else {
        res.redirect('http://localhost:3000/new-freelancer/link-accounts');
      }
    })(req,res,next)
  },
);

router.get('/dashboard', async function (req, res, next) {
  console.log(res)
})

router.post("/login/fb", userController.loginFbTK)

router.post("/language/create", userController.createLanguage);

router.post("/language/get-all", userController.getAllLanguage);

router.get("/email-verification", userController.verificationEmail);


module.exports = router;
