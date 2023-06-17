const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError, handleSuccess } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const Currency = db.currencies;
const JobSubCategories = db.jobsubcategories;
const JobSkillset = db.jobskillset;
const UserProfile = db.userprofile;
const User_Skillset = db.user_skillset
const SubCategoriesandSkillset = db.subcategoryandskillset;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const CurrencyService = {
  getAllCurrency: async (req, res) => {
    try {
      const result = await Currency.findAll({});
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = CurrencyService;
