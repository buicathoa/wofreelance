const userService = require("../services/user.service")
const { handleSuccess, handleError } = require("../utils/handleResponse")

const userController = {
    registerAccount: async(req, res) => {
        try{
            const userCreated = await userService.registerAccount(req.body, res)
            if(userCreated === 201){
                return res.status(201).json("This email address was created.")
            } else {
                return handleSuccess(res, userCreated, {message: "Account is created successfully."})
            }
            // return handleSuccess(res, userCreated, {message: "Account was created!"})
        }
        catch(err){
            return handleError(res, err)
        }
    },

    loginUser: async (req, res) => {
        try {
            const result = await userService.loginUser(req.body, res) 
            if(result === 1){
                return handleSuccess(res, {message: 'Invalid email or password.'})
            } else if(result === 2){
                return handleSuccess(res, {message: "User is not active."})
            } else {
                return handleSuccess(res, result, {message: 'Login success.'})
            }
        } catch (err) {
            return handleError(res, err)
        }
    },

    getUserInfo: async(req, res) => {
        try {
            const result = await userService.getUserInfo(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },

    getAllUser: async(req, res) => {
        try {
            const result = await userService.getAllUser(req, res)
            return handleSuccess(res, result)
        } catch (err) {
            return handleError(res, err)
        }
    },

    updateUser: async(req, res) => {
        try {
            const result = await userService.updateUser(req, res)
            return handleSuccess(res, result)
        } catch(err) {
            return handleError(res, err)
        }
    },

    createServiceProfile: async(req, res) => {
        try{
            const result = await userService.createServiceProfile(req, res)
            return handleSuccess(res, result)
        } catch(err) {
            return handleError(res, err)
        }
    }
}

module.exports = userController