const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("./../../models");
const UserProfile = db.userprofile;
const axios = require('axios')
const { handleSuccess, handleError } = require("../../utils/handleResponse");
require('dotenv').config();

const userController = {
  registerAccount: async (req, res) => {
    try {
      const userCreated = await userService.registerAccount(req.body, res);
      if (userCreated === 201) {
        return res.status(201).json("This email address was created.");
      } else {
        return handleSuccess(res, userCreated, {
          message: "Account is created successfully.",
        });
      }
      // return handleSuccess(res, userCreated, {message: "Account was created!"})
    } catch (err) {
      return handleError(res, err);
    }
  },

  loginUser: async (req, res, socket, io) => {
    try {
      const result = await userService.loginUser(req, res, socket, io);
      if (result === 1) {
        return res.status(400).json({ message: "Invalid email, password or account status" });
      } else if (result === 2) {
        return res.status(403).json({ message: "Account may not active" });
      } else {
        return handleSuccess(res, result, { message: "Login success." });
      }
    } catch (err) {
      return handleError(res, err);
    }
  },

  logoutUser : async (req, res) => {
    try {
      const result = await userService.logoutUser(req, res);
      return handleSuccess(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const result = await userService.getUserInfo(req, res);
      if (result === 1) {
        return res.status(400).json({ message: "User not found." });
      } else {
        return handleSuccess(res, result);
      }
    } catch (err) {
      return handleError(res, err);
    }
  },

  getUserInfoDestination: async (req, res) => {
    try {
      const result = await userService.getUserInfoDestination(req, res);
      if (result === 1) {
        return res.status(400).json({ message: "User not found." });
      } else {
        return handleSuccess(res, result);
      }
    } catch (err) {
      return handleError(res, err);
    }
  },

  getAllUser: async (req, res) => {
    try {
      const result = await userService.getAllUser(req, res);
      return handleSuccess(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const result = await userService.updateUser(req, res);
      return handleSuccess(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const result = await userService.deleteUser(req, res);
      return handleSuccess(res, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  checkUser: async (req, res) => {
    try {
      const result = await userService.checkUser(req, res);
      if (!result) {
        return handleSuccess(
          res,
          result,
          `This ${
            req?.body?.email ? req?.body?.email : req?.body?.username
          } has been existed.`
        );
      } else {
        return handleSuccess(res, result);
      }
    } catch (err) {
      return handleError(res, err);
    }
  },

  createLanguage: async (req, res) => {
    try {
      const result = await userService.createLanguage(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  getAllLanguage: async (req, res) => {
    try {
      const result = await userService.getAllLanguage(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },


  getAllSkillset: async (req, res) => {
    try {
      const result = await userService.getAllSkillset(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },
  createDelSkillset: async (req, res) => {
    try {
      const result = await userService.createDelSkillset(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },


  verificationEmail: async (req, res) => {
    try {
      const result = await userService.verificationEmail(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  emailVerified: async (req, res) => {
    try {
      res.redirect(
        `${process.env.URL_FRONTEND}/new-freelancer/email-verification`
      );
      // await io.to(`user_id_${result.id}`).emit(USER_INFO, result)
    } catch (err) {
      return handleError(res, err);
    }
  },

  loginFbTK : async (req, res) => {
    try {
      const result = await userService.loginFacebookToken(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  generatedAddress: async (req, res) => {
    try {
      const result = await userService.generatedAddress(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  getUserLoggedIn: async (req, res) => {
    try {
      const result = await userService.getUserLoggedIn(req, res);
      return handleSuccess(res, result, { message: "Action successfully." });
    } catch (err) {
      return handleError(res, err);
    }
  }
};

module.exports = userController;
