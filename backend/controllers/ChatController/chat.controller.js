const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const countryService = require("../../services/CountryService/country.service");
const CurrencyService = require("../../services/CurrencyService/currency.service");
const BudgetService = require("../../services/BudgetService/budget.service");
const ChatService = require("../../services/ChatService/chat.service");

const ChatController = {
  sendMessages: async ( req, res) => {
    try {
      const messages = await ChatService.sendMessages(req, res);
      return handleSuccess(res, messages, {message: "Send messages success"})
    } catch (err) {
      return handleError(res, err);
    }
  }
};

module.exports = ChatController;
