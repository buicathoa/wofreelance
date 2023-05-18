// import userController from "../controllers/userController"
const router = require('express').Router()
const countryController = require('../../controllers/CountryController/country.controller');
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');
const { uploadImage } = require('../../utils/helper');


router.post("/create", authorize(['director', 'admin']), countryController.createCountry)
router.post("/get", authorize(['director', 'admin', 'user']), countryController.getCountries)

module.exports = router