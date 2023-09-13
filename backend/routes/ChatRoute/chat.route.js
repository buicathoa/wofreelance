// import userController from "../controllers/userController"
const router = require('express').Router()
const ChatController = require('../../controllers/ChatController/chat.controller');
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const qualificationController = require('../../controllers/QualificationController/qualification.controller.');
const authorize = require('../../middlewares/authorize');


router.post("/messages/send", authorize(['director', 'admin', 'user']) , ChatController.sendMessages)

router.post("/messages/latest/get-all", authorize(['director', 'admin', 'user']) , ChatController.getAllLatestMessages)

router.post("/messages/latest/room/get-by-id", authorize(['director', 'admin', 'user']) , ChatController.getLatestMessageOfRoom)

router.post("/messages/detail/get-all", authorize(['director', 'admin', 'user']) , ChatController.getMessagesDetail)

router.post("/messages/unread/get-all", authorize(['director', 'admin', 'user']) , ChatController.getUnreadMessages)

router.post("/room/get-by-id", authorize(['director', 'admin', 'user']) , ChatController.getRoomDetail)

module.exports = router