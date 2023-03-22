const PostService = require("../../services/PostsService/posts.service")
const { handleSuccess, handleError } = require("../../utils/handleResponse")

const postsController = {
    create: async(req, res) => {
        try{
            const postCreated = await PostService.create(req, res)
            return handleSuccess(res, postCreated, {message: "Your post is waiting verified."})
        }
        catch(err){
            return handleError(res, err)
        }
    },
}

module.exports = postsController