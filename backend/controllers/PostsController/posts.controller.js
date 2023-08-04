const PostService = require("../../services/PostsService/posts.service")
const { handleSuccess, handleError } = require("../../utils/handleResponse")

const postsController = {
    createPosts: async(req, res) => {
        try{
            const postCreated = await PostService.createPosts(req, res)
            return handleSuccess(res, postCreated, {message: "Your post is waiting verified."})
        }
        catch(err){
            return handleError(res, err)
        }
    },

    getAllPersonalPost: async(req, res) => {
        try {
            const result = await PostService.getAllPersonalPost(req, res)
            return handleSuccess(res, result)
        } catch(err) {
            return handleError(res, err)
        }
    },

    getAllPosts: async(req, res) => {
        try {
            const result = await PostService.getAllPosts(req, res)
            return handleSuccess(res, result)
        } catch(err) {
            return handleError(res, err)
        }
    },

    getPostByRoute: async(req, res) => {
        try {
            const result = await PostService.getPostByRoute(req, res)
            return handleSuccess(res, result)
        } catch(err) {
            return handleError(res, err)
        }
    },


    editPosts: async(req, res) => {
        try {
            const result = await PostService.editPosts(req, res)
            return handleSuccess(res, result)
        } catch(err) {
            return handleError(res, err)
        }
    },

    changeStatusPost: async(req, res) => {
        try {
            const result = await PostService.changeStatusPost(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    }
}

module.exports = postsController