const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../../utils/handleResponse");
const { Op, col, Sequelize } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const { validateRole } = require("../../utils/validateRole");
const QueryParameter = require("../../utils/QueryParameter");
const userService = require("../UserService/user.service");
const Experience = db.experiences;
const User_Experiences = db.user_experiences;
const Portfolios = db.portfolio;
const Posts_skillsets = db.post_skillsets;
const UserProfiles = db.userprofile;
const JobSkillset = db.jobskillset;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const PortfolioService = {
  createPortfolio: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    let portfoliosResponse = [];
    try {
      const checkRole = await validateRole.create(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        const listSkills = JSON.parse(req.body.list_skills)
        const portfolios = listSkills.map((skill) => {
          return { skillset_id: parseInt(skill),  user_id: req.body.user_id ?? decoded.id, description: req.body.description, file: req.files.length > 0 ? req.files.map((file) => {
            return file.path
          }).join(', ') : null, summary: req.body.summary, title: req.body.title}
        })
        portfoliosResponse = await Portfolios.bulkCreate(portfolios);
        
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403);
      } else if (checkRole === 2) {
        throw new ClientError("Bad request.");
      }
      await transaction.commit();
      return portfoliosResponse;
      // return result
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

module.exports = PortfolioService;
