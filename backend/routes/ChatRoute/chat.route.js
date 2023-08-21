// import userController from "../controllers/userController"
const router = require('express').Router()
const ChatController = require('../../controllers/ChatController/chat.controller');
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const qualificationController = require('../../controllers/QualificationController/qualification.controller.');
const authorize = require('../../middlewares/authorize');


router.post("/send", authorize(['director', 'admin', 'user']) , ChatController.sendMessages)

router.post("/latest/get-all", authorize(['director', 'admin', 'user']) , ChatController.getAllLatestMessages)

router.post("/latest/room/get-by-id", authorize(['director', 'admin', 'user']) , ChatController.getLatestMessageOfRoom)

router.post("/detail/get-all", authorize(['director', 'admin', 'user']) , ChatController.getMessagesDetail)


module.exports = router