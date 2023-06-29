const CONSTANT = require("../../constants");
const userService = require("../../services/UserService/user.service");
const db = require("../../models");
const UserProfile = db.userprofile;
const { handleSuccess, handleError } = require("../../utils/handleResponse");
const ExperienceService = require("../../services/ExperienceService/experience.service");
const countryService = require("../../services/CountryService/country.service");
const CurrencyService = require("../../services/CurrencyService/currency.service");
const PortfolioService = require("../../services/PortfolioService/portfolio.service");

const portfolioController = {
  createPortfolio: async ( req, res) => {
    try {
      const portfolio = await PortfolioService.createPortfolio(req, res);
      return handleSuccess(res, portfolio, {message: "Create portfolio successfully."})
    } catch (err) {
      return handleError(res, err);
    }
  },

  getPortfolios: async ( req, res) => {
    try {
      const portfolios = await PortfolioService.getPortfolios(req, res);
      return handleSuccess(res, portfolios, "Get portfolios successfully.")
    } catch (err) {
      return handleError(res, err);
    }
  },

  deletePortfolios: async ( req, res) => {
    try {
      const portfolios = await PortfolioService.deletePortfolios(req, res);
      return handleSuccess(res, portfolios, "Delete portfolios successfully.")
    } catch (err) {
      return handleError(res, err);
    }
  },

  updatePortfolio: async ( req, res) => {
    try {
      const portfolios = await PortfolioService.updatePortfolio(req, res);
      return handleSuccess(res, portfolios, "Update portfolios successfully.")
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = portfolioController;
