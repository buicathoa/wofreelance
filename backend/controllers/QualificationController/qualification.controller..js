const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const QualificationsService = require("../../services/Qualifications/qualifications.service");

const qualificationController = {
  createQualification: async (req, res) => {
    try {
      const experienceCreated = await QualificationsService.createQualification(req, res);
      return handleSuccess(res, experienceCreated, {message: "Experience was created!"})
    } catch (err) {
      return handleError(res, err);
    }
  },

  updateQualification: async (req, res) => {
    try {
      const result = await QualificationsService.updateQualification(req, res);
      return handleSuccess(res, result, { message: "Action success." });
    } catch (err) {
      return handleError(res, err);
    }
  },

  deleteQualification: async (req, res) => {
    try {
      const result = await QualificationsService.deleteQualification(req, res);
      return handleSuccess(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  },

  getAllQualifications: async (req, res) => {
    try {
        const result = await QualificationsService.getAllQualifications(req, res);
        return handleSuccess(res, result, {message: 'Get all user experiences success.'});
      } catch (err) {
        return handleError(res, err);
      }
  }
};

module.exports = qualificationController;
