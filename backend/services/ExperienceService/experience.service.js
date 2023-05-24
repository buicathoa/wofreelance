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
const JobSubCategories = db.jobsubcategories;
const Posts_skillsets = db.post_skillsets;
const UserProfiles = db.userprofile;
const JobSkillset = db.jobskillset;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const ExperienceService = {
  createExperience: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    let newExperience;
    try {
      const checkRole = await validateRole.create(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        newExperience = await Experience.create({ ...req.body });
        if (newExperience) {
          await User_Experiences.create({
            user_id: req.body.user_id ?? decoded.id,
            experience_id: newExperience.id,
          });
        }
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403);
      } else if (checkRole === 2) {
        throw new ClientError("Bad request.");
      }
      await transaction.commit();
      const { password, ...others } = newExperience.dataValues;
      return others;
      // return result
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  updateExperience: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let exp;
    try {
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        exp = await Experience.update(
          {
            ...req.body,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );
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

  deleteExperience: async (req, res) => {
    try {
      let exp = {};
      const decoded = jwt_decode(req.headers.authorization);
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.id,
        UserProfiles
      );
      if (checkRole === 1) {
        exp = await Experience.destroy({
          where: {
            id: req.body.id,
          },
        });
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      } else if (checkRole === 0) {
        throw new ClientError("You  are not allowed to do this action.");
      }
      return exp;
    } catch (err) {
      throw err;
    }
  },

  getAllExperiences: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const user_experiences = await UserProfiles.findOne({
        attributes: [],
        where: {
          id: req.body.user_id ?? decoded.id,
        },
        include: [
          {
            model: Experience,
            as: 'list_experiences',
            through: {
              attributes: [],
            },
            sort: ['updatedAt', 'DESC']
          },
        ]
      });

      // let response = user_experiences.list_experiences((exp) => {
      //   const {user_experiences, ...other} = exp.dataValues 
      //   return other
      // })
      return user_experiences?.list_experiences;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = ExperienceService;
