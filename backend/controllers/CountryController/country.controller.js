const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("./../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const countryService = require("../../services/CountryService/country.service");

const countryController = {
  createCountry: async (req, res) => {
    try {
      const experienceCreated = await countryService.createCountry(req, res);
      return handleSuccess(res, experienceCreated, {message: "Experience was created!"})
    } catch (err) {
      return handleError(res, err);
    }
  },

  getCountries: async ( req, res) => {
    try {
      const countries = await countryService.getCountries(req, res);
      return handleSuccess(res, countries, {message: "Get countries successfully."})
    } catch (err) {
      return handleError(res, err);
    }
  }
};

module.exports = countryController;
