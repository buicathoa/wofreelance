// import userController from "../controllers/userController"
const router = require('express').Router()
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');


router.post("/create", authorize(['director', 'admin']) , jobCategoriesController.createCategory)
router.post("/update", authorize(['director', 'admin']) , jobCategoriesController.updateCategory)
router.post("/delete", authorize(['director', 'admin']) , jobCategoriesController.deleteCategory)
router.post("/get-all", authorize(['director', 'admin', 'user']) , jobCategoriesController.getAllCategory)

router.post("/skillset-new-freelance/get-all", jobCategoriesController.getAllSkillsetForNewFreelance)


//child-categories
router.post("/skillset/create", authorize(['director', 'admin']) , jobCategoriesController.createSkillsetcategory)
router.post("/skillset/user/get-all", authorize(['director', 'admin', 'user']) , jobCategoriesController.getAllSkillsetForUser)
router.post("/skillset/user/create-delete", authorize(['director', 'admin', 'user']) , jobCategoriesController.createDelSkillset)
router.post("/skillset/get-all", jobCategoriesController.getAllSkillset)


//Sub-child categoriesgetAllSubcategoryandSkillset
// router.post("/sub-child/create", authorize(['super_admin'], 'others') , jobCategoriesController.createSubChildCategory)

// router.post("/service/create", authorize('create') , userController.createServiceProfile)

module.exports = router