// import userController from "../controllers/userController"
const router = require('express').Router()
const BiddingController = require('../../controllers/BiddingController/bidding.controller');
const BudgetController = require('../../controllers/BudgetController/budget.controller');
const countryController = require('../../controllers/CountryController/country.controller');
const currencyController = require('../../controllers/CurrencyController/currency.controller');
const experienceController = require('../../controllers/ExperienceController/experience.controller');
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');
const BudgetService = require('../../services/BudgetService/budget.service');

router.post("/get-all", authorize(['director', 'admin', 'user']), BiddingController.getAllBidding)
router.post("/create", authorize(['director', 'admin', 'user']), BiddingController.createBidding)
router.post("/update", authorize(['director', 'admin', 'user']), BiddingController.updateBidding)
router.post("/delete", authorize(['director', 'admin', 'user']), BiddingController.deleteBidding)


// router.post("/create", authorize(['director', 'admin', 'user']), BudgetService.createBudgets)


module.exports = router