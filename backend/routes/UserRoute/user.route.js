// import userController from "../controllers/userController"
const router = require('express').Router()
const userController = require("../../controllers/UserController/user.controller");
const { uploadImage } = require('../../utils/helper');
const db = require("../../models");
const authorize = require('../../middlewares/authorize');


router.post("/register", userController.registerAccount)
router.post("/login", userController.loginUser)
router.post("/get-info", authorize(['director', 'admin', 'user']), userController.getUserInfo)
router.post("/get-all", authorize(['director', 'admin']), userController.getAllUser)
router.post("/update", authorize(['director', 'admin', 'user']), uploadImage('avatar').single('image') ,userController.updateUser)
router.post("/delete", authorize(['director', 'admin']) ,userController.deleteUser)
// router.post("/service/create", authorize('create') , userController.createServiceProfile)

module.exports = router