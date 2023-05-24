const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const EducationService = require("../../services/EducationService/education.service");

const educationnController = {
  createEducationUser: async (req, res) => {
    try {
      const educationCreated = await EducationService.createEducationUser(req, res);
      return handleSuccess(res, educationCreated, {message: "Education was created!"})
    } catch (err) {
      return handleError(res, err);
    }
  },

  updateEducationUser: async (req, res) => {
    try {
      const result = await EducationService.updateEducationUser(req, res);
      return handleSuccess(res, result, { message: "Action success." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  deleteEducationUser: async (req, res) => {
    try {
      const result = await EducationService.deleteEducationUser(req, res);
      return handleSuccess(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  },

  getAllEducationUser: async (req, res) => {
    try {
        const result = await EducationService.getAllEducationUser(req, res);
        return handleSuccess(res, result, {message: 'Get all user educations success.'});
      } catch (err) {
        return handleError(res, err);
      }
  },

  getlistUniByCountry: async (req, res) => {
    try {
        const result = await EducationService.getlistUniByCountry(req, res);
        return handleSuccess(res, result, {message: 'Get all user educations success.'});
      } catch (err) {
        return handleError(res, err);
      }
  },
};

module.exports = educationnController;
