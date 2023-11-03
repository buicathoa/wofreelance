const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const countryService = require("../../services/CountryService/country.service");
const CurrencyService = require("../../services/CurrencyService/currency.service");
const BudgetService = require("../../services/BudgetService/budget.service");
const BiddingService = require("../../services/BiddingService/bidding.service");

const BiddingController = {
  getAllBidding: async (req, res) => {
    try {
      const biddings = await BiddingService.getAllBidding(req, res);
      return handleSuccess(res, biddings, { message: "Get all Bidding success" });
    } catch (err) {
      return handleError(res, err);
    }
  },

  getBiddingById: async (req, res) => {
    try {
      const biddings = await BiddingService.getBiddingById(req, res);
      return handleSuccess(res, biddings, { message: "success" });
    } catch (err) {
      return handleError(res, err);
    }
  },

  createBidding: async (req, res) => {
    try {
      const biddings = await BiddingService.createBidding(req, res);
      return handleSuccess(res, biddings, { message: "Bidding success" });
    } catch (err) {
      return handleError(res, err);
    }
  },

  updateBidding: async (req, res) => {
    const biddings = await BiddingService.updateBidding(req, res);
    return handleSuccess(res, biddings, { message: "Update bidding success" });
  },

  deleteBidding: async (req, res) => {
    const biddings = await BiddingService.deleteBidding(req, res);
    return handleSuccess(res, biddings, { message: "Retract bidding success" });
  },

  createAwardBid: async (req, res) => {
    try {
      const result = await BiddingService.createAwardBid(req, res);
      return handleSuccess(res, result)
    } catch (err) {
      return handleError(res, err)
    }
  },

  getAllPersonalBidding: async (req, res) => {
    const result = await BiddingService.getAllPersonalBidding(req, res);
    return handleSuccess(res, result)
  },

  updateAwardBid: async (req, res) => {
    const result = await BiddingService.updateAwardBid(req, res);
    return handleSuccess(res, result)
  },
  
  deleteAwardBid: async (req, res) => {
    const result = await BiddingService.deleteAwardBid(req, res);
    return handleSuccess(res, result)
  },

  acceptAwardBid: async (req, res) => {
    const result = await BiddingService.acceptAwardBid(req, res);
    return handleSuccess(res, result)
  }
};

module.exports = BiddingController;
