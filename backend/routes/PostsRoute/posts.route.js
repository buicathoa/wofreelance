// import userController from "../controllers/userController"
const router = require('express').Router()
const postsController = require("../../controllers/PostsController/posts.controller");
const authorize = require('../../middlewares/authorize');
const { uploadImage } = require('../../utils/helper');


router.post("/create", authorize(['super_admin', 'admin', 'user'], 'others') , postsController.createPosts)
router.post("/get-all", authorize(['super_admin', 'admin', 'user'], 'others') , postsController.getAllPosts)

// router.post("/update", authorize(['super_admin'], 'others') , jobCategoriesController.updateCategory)
// router.post("/delete", authorize(['super_admin'], 'others') , jobCategoriesController.deleteCategory)
// router.post("/get-all", authorize(['super_admin', 'admin', 'user'], 'others') , jobCategoriesController.getAllCategory)

// router.post('/sub/create', authorize(['super_admin'], 'others'), jobCategoriesController.createSubCategory)
// router.post('/sub/update', authorize(['super_admin'], 'others'), jobCategoriesController.updateSubCategory)
// router.post('/sub/delete', authorize(['super_admin'], 'others'), jobCategoriesController.deleteSubCategory)
// router.post('/sub/get-all', authorize(['super_admin'], 'others'), jobCategoriesController.getAllSubCategory)


// router.post("/service/create", authorize('create') , userController.createServiceProfile)

module.exports = router