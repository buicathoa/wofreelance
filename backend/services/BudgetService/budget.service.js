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
const User_Skillset = db.user_skillset;
const Budgets = db.budgets;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const BudgetService = {
  getBudgets: async (req, res) => {
    try {
      const result = await Budgets.findAll({
        where: {
          currency_id: req.body.currency_id,
          project_type: req.body.project_type,
        },
        include: [
          {
            model: Currency,
            as: 'currency'
          }
        ]
      });
      return result;
    } catch (err) {
      throw err;
    }
  },
  // createBudgets: async (req, res) => {
  //   try {
  //     let hihi = [
  //       {
  //         minimum: 2,
  //         maximum: 8,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 1,
  //       },
  //       {
  //         minimum: 8,
  //         maximum: 15,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 1,
  //       },
  //       {
  //         minimum: 15,
  //         maximum: 25,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 1,
  //       },
  //       {
  //         minimum: 25,
  //         maximum: 50,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 1,
  //       },
  //       {
  //         minimum: 50,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 1,
  //       },
  //       {
  //         minimum: 3,
  //         maximum: 10,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 2,
  //       },
  //       {
  //         minimum: 10,
  //         maximum: 20,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 2,
  //       },
  //       {
  //         minimum: 20,
  //         maximum: 30,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 2,
  //       },
  //       {
  //         minimum: 30,
  //         maximum: 60,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 2,
  //       },
  //       {
  //         minimum: 60,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 2,
  //       },
  //       {
  //         minimum: 2,
  //         maximum: 8,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 3,
  //       },
  //       {
  //         minimum: 8,
  //         maximum: 15,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 3,
  //       },
  //       {
  //         minimum: 15,
  //         maximum: 25,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 3,
  //       },
  //       {
  //         minimum: 25,
  //         maximum: 50,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 3,
  //       },
  //       {
  //         minimum: 50,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 3,
  //       },
  //       {
  //         minimum: 2,
  //         maximum: 5,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 4,
  //       },
  //       {
  //         minimum: 5,
  //         maximum: 10,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 4,
  //       },
  //       {
  //         minimum: 10,
  //         maximum: 15,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 4,
  //       },
  //       {
  //         minimum: 18,
  //         maximum: 36,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 4,
  //       },
  //       {
  //         minimum: 36,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 4,
  //       },
  //       {
  //         minimum: 16,
  //         maximum: 65,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 5,
  //       },
  //       {
  //         minimum: 65,
  //         maximum: 115,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 5,
  //       },
  //       {
  //         minimum: 115,
  //         maximum: 200,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 5,
  //       },
  //       {
  //         minimum: 200,
  //         maximum: 400,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 5,
  //       },
  //       {
  //         minimum: 400,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 5,
  //       },
  //       {
  //         minimum: 3,
  //         maximum: 10,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 6,
  //       },
  //       {
  //         minimum: 10,
  //         maximum: 20,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 6,
  //       },
  //       {
  //         minimum: 20,
  //         maximum: 30,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 6,
  //       },
  //       {
  //         minimum: 30,
  //         maximum: 60,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 6,
  //       },
  //       {
  //         minimum: 60,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 6,
  //       },
  //       {
  //         minimum: 2,
  //         maximum: 6,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 7,
  //       },
  //       {
  //         minimum: 6,
  //         maximum: 12,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 7,
  //       },
  //       {
  //         minimum: 12,
  //         maximum: 18,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 7,
  //       },
  //       {
  //         minimum: 18,
  //         maximum: 36,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 7,
  //       },
  //       {
  //         minimum: 36,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 7,
  //       },
  //       {
  //         minimum: 2,
  //         maximum: 8,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 8,
  //       },
  //       {
  //         minimum: 8,
  //         maximum: 15,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 8,
  //       },
  //       {
  //         minimum: 15,
  //         maximum: 25,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 8,
  //       },
  //       {
  //         minimum: 25,
  //         maximum: 50,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 8,
  //       },
  //       {
  //         minimum: 50,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 8,
  //       },
  //       {
  //         minimum: 100,
  //         maximum: 400,
  //         name: "Basic",
  //         project_type: "hourly",
  //         currency_id: 9,
  //       },
  //       {
  //         minimum: 400,
  //         maximum: 750,
  //         name: "Moderate",
  //         project_type: "hourly",
  //         currency_id: 9,
  //       },
  //       {
  //         minimum: 750,
  //         maximum: 1250,
  //         name: "Standard",
  //         project_type: "hourly",
  //         currency_id: 9,
  //       },
  //       {
  //         minimum: 1250,
  //         maximum: 2500,
  //         name: "Skilled",
  //         project_type: "hourly",
  //         currency_id: 9,
  //       },
  //       {
  //         minimum: 2500,
  //         name: "Expert",
  //         project_type: "hourly",
  //         currency_id: 9,
  //       },
  //     ];
  //     const budgets = await Budgets.bulkCreate(hihi);
  //     return budgets;
  //   } catch (err) {
  //     throw err;
  //   }
  // },
};

module.exports = BudgetService;
