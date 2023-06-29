const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../../utils/handleResponse");
const { Op, col, Sequelize, literal } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const { validateRole } = require("../../utils/validateRole");
const QueryParameter = require("../../utils/QueryParameter");
const userService = require("../UserService/user.service");
const { object } = require("joi");
const Portfolio_Skillset = db.portfolio_skillset;
const User_Skillset = db.user_skillset;
const Portfolios = db.portfolio;
const Posts_skillsets = db.post_skillsets;
const UserProfiles = db.userprofile;
const JobSkillset = db.jobskillset;
const UserSkillset = db.user_skillset;
const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const PortfolioService = {
  createPortfolio: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    try {
      const checkRole = await validateRole.create(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        const { list_skills, ...obj } = req.body;
        const portfolio = await Portfolios.create({
          portfolio_type: obj.portfolio_type,
          ...obj,
          file: obj.files.length > 0 ? obj.files.join(",") : null,
          user_id: req.body.user_id ?? decoded.id,
        });

        const result = await UserSkillset.count({
          where: {
            skillset_id: {
              [Op.in]: list_skills
            },
            user_id: req.body.user_id ?? decoded.id
          },
        });
        if(list_skills.length !== result) {
          throw new ClientError("Some skill are not belonging to current user.")
        }
        await list_skills.map(async(skill) => {
            await Portfolio_Skillset.create({
              portfolio_id: portfolio.id,
              skillset_id: skill
            })
        })
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403);
      } else if (checkRole === 2) {
        throw new ClientError("Bad request.");
      }
      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  getPortfolios: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    try {
      const result = await Portfolios.findAll({
        include: [
          {
            model: JobSkillset,
            attributes: {
              exclude: ['category_id', 'createdAt', 'updatedAt']
            },
            through: {
              attributes: [],
            },
            as: "skills",
          },
        ],
        where: {
          user_id: req.body.user_id ?? decoded.id
        }
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  deletePortfolios: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        await Portfolios.destroy({
          where: {
            id: req.body.id,
          },
        });
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      } else if (checkRole === 0) {
        throw new ClientError("You  are not allowed to do this action.");
      }
      return true;
    } catch (err) {
      throw err;
    }
  },

  updatePortfolio: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        const {list_skills, ...obj} = req.body
        await Portfolios.update({
          ...obj,
          file: obj.files.length > 0 ? obj.files.join(",") : null,
        }, {
          where: {
            id: obj.id
          }
        })
        await Portfolio_Skillset.destroy({
          where: {
            portfolio_id: obj.id
          }
        })

        const result = await UserSkillset.count({
          where: {
            skillset_id: {
              [Op.in]: list_skills
            },
            user_id: req.body.user_id ?? decoded.id
          },
        });
        if(list_skills.length !== result) {
          throw new ClientError("Some skill are not belonging to current user.")
        }

        list_skills.map(async(skill) => {
          await Portfolio_Skillset.create({
            portfolio_id: obj.id,
            skillset_id: skill
          })
        })
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      } else if (checkRole === 0) {
        throw new ClientError("You  are not allowed to do this action.");
      }
      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

module.exports = PortfolioService;
