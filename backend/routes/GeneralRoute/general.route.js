// import userController from "../controllers/userController"
const router = require("express").Router();
const experienceController = require("../../controllers/ExperienceController/experience.controller");
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const qualificationController = require("../../controllers/QualificationController/qualification.controller.");
const authorize = require("../../middlewares/authorize");
const multer = require("multer");
const validateFileSize = require("../../middlewares/validateFileSize");
const generalController = require("../../controllers/GeneralController/general.controller");

router.post(
  "/files/upload",
  authorize(["director", "admin", "user"]),
  (req, res, next) => {
    validateFileSize(req, res, next);
  },
);

module.exports = router;
