const PostService = require("../../services/PostsService/posts.service")
const { handleSuccess, handleError } = require("../../utils/handleResponse")

const postsController = {
    createPosts: async(req, res) => {
        try{
            const postCreated = await PostService.createPosts(req, res)
            return handleSuccess(res, postCreated, {message: "Your post is waiting verified."})
        }
        catch(err){
            return res.status(500).json({message: "An error occurred while inserting the record."})
        }
    },

    getAllPosts: async(req, res) => {
        try {
            const result = await PostService.getAllPersonalPosts(req, res)
            return handleSuccess(res, result)
        } catch(err) {
            return handleError(res, err)
        }
    }

    // insertSkillsetPosts: async(req, res) => {
    //     try{
    //         const postCreated = await PostService.insertSkillsetAndPosts(req, res)
    //         return handleSuccess(res, postCreated, {message: "Your post is waiting verified."})
    //     }catch(err){
    //         return handleError(res, err)
    //     }
    // }
}

module.exports = postsController