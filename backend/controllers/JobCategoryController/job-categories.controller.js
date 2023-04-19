const JobCategoryService = require("../../services/JobCategoryService/job-categories.service");
const { handleSuccess, handleError } = require("../../utils/handleResponse")

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

    //Skillset category
    createSkillsetcategory: async (req, res) => {
        try{
            const result = await JobCategoryService.createSkillsetcategory(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },

    getAllSkillset: async (req, res) => {
        try{
            const result = await JobCategoryService.getAllSkillset(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },

    getAllSkillsetForNewFreelance: async(req, res) => {
        try{
            const listCategory = await JobCategoryService.getAllSkillsetForNewFreelance(req, res)
            return handleSuccess(res, listCategory, {message: "Success"})
        }
        catch(err){
            return handleError(res, err)
        }
    },
    
    //Sub-child category
    // createSubChildCategory: async (req, res) => {
    //     try{
    //         const result = await JobCategoryService.createSubChildcategory(req, res)
    //         return handleSuccess(res, result)
    //     } catch (err) {
    //         return handleError(res, err)
    //     }
    // },
}

module.exports = jobCategoriesController