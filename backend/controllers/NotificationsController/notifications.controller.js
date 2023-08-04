const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const countryService = require("../../services/CountryService/country.service");
const CurrencyService = require("../../services/CurrencyService/currency.service");
const PortfolioService = require("../../services/PortfolioService/portfolio.service");
const NotificationsService = require("../../services/Notifications/notifications.service");

const notificationsController = {
  getAllNotifications: async ( req, res) => {
    try {
        const notifications = await NotificationsService.getAllNotifications(req, res);
        return handleSuccess(res, notifications, {message: "Get notifications successfully."})
      } catch (err) {
        return handleError(res, err);
      }
  },
  updateNotification: async ( req, res) => {
    try {
        const notifications = await NotificationsService.updateNotification(req, res);
        return handleSuccess(res, notifications, {message: "Update notifications successfully."})
      } catch (err) {
        return handleError(res, err);
      }
  },
};

module.exports = notificationsController;
