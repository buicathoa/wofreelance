// import userController from "../controllers/userController"
const router = require('express').Router()
const educationnController = require('../../controllers/EducationController/education.controller');
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');


router.post("/user/create", authorize(['director', 'admin', 'user']) , educationnController.createEducationUser)
router.post("/user/update", authorize(['director', 'admin', 'user']) , educationnController.updateEducationUser)
router.post("/user/delete", authorize(['director', 'admin', 'user']) , educationnController.deleteEducationUser)
router.post("/user/get-all", authorize(['director', 'admin', 'user']) , educationnController.getAllEducationUser)
router.post("/get-all", authorize(['director', 'admin', 'user']) , educationnController.getlistUniByCountry)


module.exports = router