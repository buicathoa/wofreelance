// import userController from "../controllers/userController"
const router = require('express').Router()
const jobCategoriesController = require("../../controllers/JobCategoryController/job-categories.controller");
const authorize = require('../../middlewares/authorize');
const { uploadImage } = require('../../utils/helper');


router.post("/create", authorize(['super_admin'], 'others') , jobCategoriesController.createCategory)
router.post("/update", authorize(['super_admin'], 'others') , jobCategoriesController.updateCategory)
router.post("/delete", authorize(['super_admin'], 'others') , jobCategoriesController.deleteCategory)
router.post("/get-all", authorize(['super_admin', 'admin', 'user'], 'others') , jobCategoriesController.getAllCategory)

router.post('/sub/create', authorize(['super_admin'], 'others'), jobCategoriesController.createSubCategory)
router.post('/sub/update', authorize(['super_admin'], 'others'), jobCategoriesController.updateSubCategory)
router.post('/sub/delete', authorize(['super_admin'], 'others'), jobCategoriesController.deleteSubCategory)
router.post('/sub/get-all', authorize(['super_admin'], 'others'), jobCategoriesController.getAllSubCategory)

//child-categories
router.post("/skillset/create", authorize(['super_admin'], 'others') , jobCategoriesController.createSkillsetcategory)
router.post("/skillset/get-all", authorize(['super_admin'], 'others') , jobCategoriesController.getAllSkillset)

// router.post("/subcate/get-all", authorize(['super_admin'], 'others') , jobCategoriesController.getAllSubcategoryandSkillset)
//Sub-child categories
// router.post("/sub-child/create", authorize(['super_admin'], 'others') , jobCategoriesController.createSubChildCategory)

// router.post("/service/create", authorize('create') , userController.createServiceProfile)

module.exports = router