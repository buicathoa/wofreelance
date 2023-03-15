// import userController from "../controllers/userController"
const router = require('express').Router()
const userController = require("../controllers/user.controller");
const authorize = require('../middlewares/authorize');
const userService = require("../services/user.service");
const { uploadImage } = require('../utils/helper');


router.post("/register", userController.registerAccount)
router.post("/login", userController.loginUser)
router.post("/get-info", userController.getUserInfo)
router.post("/update", authorize('personal') ,uploadImage('avatar').single('image') ,userController.updateUser)

module.exports = router