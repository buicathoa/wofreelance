// import userController from "../controllers/userController"
const router = require("express").Router();
const db = require("../../models");
const postsController = require("../../controllers/PostsController/posts.controller");
const authorize = require("../../middlewares/authorize");
const checkSecretKey = require("../../middlewares/checkSecretKey");

router.post("/create", authorize(["director", "admin", "user"]), postsController.createPosts);
router.post("/get-all", postsController.getAllPosts);
router.post("/get-by-route", postsController.getPostByRoute);
router.post(
  "/personal/get-all",
  authorize(["director", "admin", "user"]),
  postsController.getAllPersonalPost
);
router.post(
  "/update",
  authorize(["director", "admin", "user"]),
  postsController.editPosts
);
router.post(
  "/status/update",
  authorize(["director", "admin"]),
  postsController.changeStatusPost
);
module.exports = router;
