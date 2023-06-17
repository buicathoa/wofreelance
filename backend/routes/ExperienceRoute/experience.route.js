// import userController from "../controllers/userController"
const router = require('express').Router()
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');


router.post("/create", authorize(['director', 'admin', 'user']) , experienceController.createExperience)
router.post("/update", authorize(['director', 'admin', 'user']) , experienceController.updateExperience)
router.post("/delete", authorize(['director', 'admin', 'user']) , experienceController.deleteExperience)
router.post("/get-all", authorize(['director', 'admin', 'user']) , experienceController.getAllExperiences)


module.exports = router