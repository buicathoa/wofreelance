// import userController from "../controllers/userController"
const router = require('express').Router()
const db = require("../../models");
const postsController = require("../../controllers/PostsController/posts.controller");
const authorize = require('../../middlewares/authorize');
const checkSecretKey = require('../../middlewares/checkSecretKey');
const { uploadFiles } = require('../../utils/helper');


router.post("/create", authorize(['director', 'admin', 'user']), uploadFiles('files').array('files'), 
        postsController.createPosts
)
router.post("/get-all", postsController.getAllPosts)
router.post("/personal/get-all", authorize(['director', 'admin', 'user']), postsController.getAllPersonalPost)
router.post("/update", authorize(['director', 'admin', 'user']), postsController.editPosts)
router.post("/status/update", authorize(['director', 'admin']), postsController.changeStatusPost)

module.exports = router