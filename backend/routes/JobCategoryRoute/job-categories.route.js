// import userController from "../controllers/userController"
const router = require('express').Router()
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');
const { uploadImage } = require('../../utils/helper');


router.post("/create", authorize(['director', 'admin']) , jobCategoriesController.createCategory)
router.post("/update", authorize(['director', 'admin']) , jobCategoriesController.updateCategory)
router.post("/delete", authorize(['director', 'admin']) , jobCategoriesController.deleteCategory)
router.post("/get-all", authorize(['director', 'admin', 'user']) , jobCategoriesController.getAllCategory)

router.post("/skillset-new-freelance/get-all", jobCategoriesController.getAllSkillsetForNewFreelance)


//child-categories
router.post("/skillset/create", authorize(['director', 'admin']) , jobCategoriesController.createSkillsetcategory)
router.post("/skillset/get-all", authorize(['director', 'admin', 'user']) , jobCategoriesController.getAllSkillset)

//Sub-child categoriesgetAllSubcategoryandSkillset
// router.post("/sub-child/create", authorize(['super_admin'], 'others') , jobCategoriesController.createSubChildCategory)

// router.post("/service/create", authorize('create') , userController.createServiceProfile)

module.exports = router