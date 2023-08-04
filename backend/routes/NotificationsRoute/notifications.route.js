// import userController from "../controllers/userController"
const router = require('express').Router()
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const notificationsController = require('../../controllers/NotificationsController/notifications.controller');
const qualificationController = require('../../controllers/QualificationController/qualification.controller.');
const authorize = require('../../middlewares/authorize');


router.post("/get-all", authorize(['director', 'admin', 'user']) , notificationsController.getAllNotifications)
router.post("/update", authorize(['director', 'admin', 'user']) , notificationsController.updateNotification)


module.exports = router