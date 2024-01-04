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
const Qualifications = db.qualifications;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const QualificationsService = {
  createQualification: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let qualification;
    try {
      const checkRole = await validateRole.create(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        qualification = await Qualifications.create({ ...req.body, user_id: req.body.user_id ?? decoded.id });
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403);
      } else if (checkRole === 2) {
        throw new ClientError("Bad request.");
      }
      return qualification;
    } catch (err) {
      throw err;
    }
  },

  updateQualification: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let qualification;
    try {
      const checkRole = await validateRole.modify(
        decoded,
        req.body.id,
        Qualifications
      );
      if (checkRole === 1) {
        qualification = await Qualifications.update(
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

  deleteQualification: async (req, res) => {
    try {
      let exp = {};
      const decoded = jwt_decode(req.headers.authorization);
      const checkRole = await validateRole.modify(
        decoded,
        req.body.id,
        Qualifications
      );
      if (checkRole === 1) {
        exp = await Qualifications.destroy({
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

  getAllQualifications: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const user_qualifications = await Qualifications.findAll({
        // attributes: [],
        where: {
          user_id: req.body.user_id ?? decoded.id,
        },
      });
      return user_qualifications;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = QualificationsService;
