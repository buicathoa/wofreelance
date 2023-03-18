// import userController from "../controllers/userController"
const router = require('express').Router()
const userController = require("../controllers/user.controller");
const authorize = require('../middlewares/authorize');
const userService = require("../services/user.service");
const { uploadImage } = require('../utils/helper');


router.post("/register", userController.registerAccount)
router.post("/login", userController.loginUser)
router.post("/get-info", authorize(['super_admin', 'admin', 'user'], 'user') ,userController.getUserInfo)
router.post("/get-all", authorize(['super_admin', 'admin'], 'user') , userController.getAllUser)
router.post("/update", authorize(['super_admin', 'admin', 'user'], 'user') ,uploadImage('avatar').single('image') ,userController.updateUser)

// router.post("/service/create", authorize('create') , userController.createServiceProfile)

module.exports = router