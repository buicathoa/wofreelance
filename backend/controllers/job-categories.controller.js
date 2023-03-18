const JobCategoryService = require("../services/job-categories.service")
const { handleSuccess, handleError } = require("../utils/handleResponse")

const jobCategoriesController = {
    createCategory: async (req, res) => {
        try{
            const result = await JobCategoryService.createCategory(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },
    updateCategory: async (req, res) => {
        try {
            const result = await JobCategoryService.updateCategory(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(err)
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const result = await JobCategoryService.deleteCategory(req, res)
            return handleSuccess(res, {message: 'Delete success.'})
        } catch (err) {
            return handleError(err)
        }
    },
    getAllCategory: async (req, res) => {
        try {
            const result = await JobCategoryService.getAllCategory(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(err)
        }
    },

    //sub-category
    createSubCategory: async (req, res) => {
        try{
            const result = await JobCategoryService.createSubCategory(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },
    updateSubCategory: async (req, res) => {
        try{
            const result = await JobCategoryService.updateSubCategory(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },
    deleteSubCategory: async (req, res) => {
        try{
            const result = await JobCategoryService.deleteSubCategory(req, res)
            return handleSuccess(res, {message: "Delete success."})
        } catch (err) {
            return handleError(res, err)
        }
    },
    getAllSubCategory: async (req, res) => {
        try{
            const result = await JobCategoryService.getAllSubCategory(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },
}

module.exports = jobCategoriesController