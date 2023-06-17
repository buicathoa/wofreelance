// import userController from "../controllers/userController"
const router = require('express').Router()
const countryController = require('../../controllers/CountryController/country.controller');
const currencyController = require('../../controllers/CurrencyController/currency.controller');
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');


router.post("/get-all", authorize(['director', 'admin', 'user']), currencyController.getAllCurrency)

module.exports = router