// import userController from "../controllers/userController"
const router = require('express').Router()
const ChatController = require('../../controllers/ChatController/chat.controller');
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const qualificationController = require('../../controllers/QualificationController/qualification.controller.');
const authorize = require('../../middlewares/authorize');


router.post("/send", authorize(['director', 'admin', 'user']) , ChatController.sendMessages)


module.exports = router