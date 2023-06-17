const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const countryService = require("../../services/CountryService/country.service");
const CurrencyService = require("../../services/CurrencyService/currency.service");
const BudgetService = require("../../services/BudgetService/budget.service");

const BudgetController = {
  getBudgets: async ( req, res) => {
    try {
      const budgets = await BudgetService.getBudgets(req, res);
      return handleSuccess(res, budgets, {message: "Get budgets successfully."})
    } catch (err) {
      return handleError(res, err);
    }
  }
};

module.exports = BudgetController;
