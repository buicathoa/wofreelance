const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("./../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const countryService = require("../../services/CountryService/country.service");
const CurrencyService = require("../../services/CurrencyService/currency.service");

const currencyController = {
  getAllCurrency: async ( req, res) => {
    try {
      const currencies = await CurrencyService.getAllCurrency(req, res);
      return handleSuccess(res, currencies, {message: "Get currencies successfully."})
    } catch (err) {
      return handleError(res, err);
    }
  }
};

module.exports = currencyController;
