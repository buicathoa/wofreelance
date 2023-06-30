// import userController from "../controllers/userController"
const router = require("express").Router();
const db = require("../../models");
const postsController = require("../../controllers/PostsController/posts.controller");
const authorize = require("../../middlewares/authorize");
const checkSecretKey = require("../../middlewares/checkSecretKey");

module.exports = function (socket, io) {
  router.post(
    "/create",
    authorize(["director", "admin", "user"]),
    (req, res) => {
        postsController.createPosts(req, res, socket, io)
    }
  );
  router.post("/get-all", postsController.getAllPosts);
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
  return router;
};
