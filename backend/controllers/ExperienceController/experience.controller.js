const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("./../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");

const experienceController = {
  createExperience: async (req, res) => {
    try {
      const experienceCreated = await ExperienceService.createExperience(req, res);
      return handleSuccess(res, experienceCreated, {message: "Experience was created!"})
    } catch (err) {
      return handleError(res, err);
    }
  },

  updateExperience: async (req, res) => {
    try {
      const result = await ExperienceService.updateExperience(req, res);
      return handleSuccess(res, result, { message: "Action success." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  deleteExperience: async (req, res) => {
    try {
      const result = await ExperienceService.deleteExperience(req, res);
      return handleSuccess(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  },

  getAllExperiences: async (req, res) => {
    try {
        const result = await ExperienceService.getAllExperiences(req, res);
        return handleSuccess(res, result, {message: 'Get all user experiences success.'});
      } catch (err) {
        return handleError(res, err);
      }
  }
};

module.exports = experienceController;
