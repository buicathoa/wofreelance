// import userController from "../controllers/userController"
const router = require('express').Router()
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const qualificationController = require('../../controllers/QualificationController/qualification.controller.');
const authorize = require('../../middlewares/authorize');
const { uploadImage } = require('../../utils/helper');


router.post("/create", authorize(['director', 'admin', 'user']) , qualificationController.createQualification)
router.post("/update", authorize(['director', 'admin', 'user']) , qualificationController.updateQualification)
router.post("/delete", authorize(['director', 'admin', 'user']) , qualificationController.deleteQualification)
router.post("/get-all", authorize(['director', 'admin', 'user']) , qualificationController.getAllQualifications)


module.exports = router