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
  },
  getAllLatestMessages: async ( req, res) => {
    try {
      const messages = await ChatService.getAllLatestMessages(req, res);
      return handleSuccess(res, messages, {message: "Get all latest messages success"})
    } catch (err) {
      return handleError(res, err);
    }
  },
  getLatestMessageOfRoom: async ( req, res) => {
    try {
      const messages = await ChatService.getLatestMessageOfRoom(req, res);
      return handleSuccess(res, messages, {message: "Get latest messages success"})
    } catch (err) {
      return handleError(res, err);
    }
  },
  getMessagesDetail: async ( req, res) => {
    try {
      const messages = await ChatService.getMessagesDetail(req, res);
      return handleSuccess(res, messages, {message: "Get all detail messages success"})
    } catch (err) {
      return handleError(res, err);
    }
  },
  getUnreadMessages: async (req, res) => {
    try {
      const unreadMess = await ChatService.getUnreadMessages(req, res);
      return handleSuccess(res, unreadMess)
    } catch (err) {
      return handleError(res, err);
    }
  },
  getRoomDetail: async (req, res) => {
    try {
      const result = await ChatService.getRoomDetail(req, res);
      return handleSuccess(res, result)
    } catch (err) {
      return handleError(res, err);
    }
  }
};

module.exports = ChatController;
