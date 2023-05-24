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
const { request } = require("http");
const Experience = db.experiences;
const User_Experiences = db.user_experiences;
const JobSubCategories = db.jobsubcategories;
const Countries = db.countries;
const UserProfiles = db.userprofile;
const User_Education = db.user_educations;
const Universities = db.universities;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const EducationService = {
  createEducationUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    let newEducation;
    let education;
    try {
      const checkRole = await validateRole.create(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        newEducation = await User_Education.create({
          user_id: req.body.user_id ?? decoded.id,
          education_id: req.body.education_id,
          country_id: req.body.country_id,
          degree: req.body.degree,
          start_year: req.body.start_year,
          end_year: req.body.end_year,
        });
        if (newEducation) {
          education = await UserProfiles.findOne({
            attributes: [],
            where: {
              id: req.body.user_id ?? decoded.id,
            },
            include: [
              {
                // attributes: [],
                model: Universities,
                as: "educations",
                // attributes: [],
                through: {
                  model: User_Education,
                  where: {
                    user_id: req.body.user_id ?? decoded.id,
                    education_id: req.body.education_id,
                    country_id: req.body.country_id,
                  },
                  attributes: [
                    "id",
                    "user_id",
                    "education_id",
                    "createdAt",
                    "updatedAt",
                    "degree",
                    "start_year",
                    "end_year",
                    "country_id",
                  ],
                  order: [["updatedAt", "DESC"]],
                  // order: [["updatedAt", "DESC"]],
                },
              },
            ],
          });
        }
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403);
      } else if (checkRole === 2) {
        throw new ClientError("Bad request.");
      }
      await transaction.commit();
      const { user_education, ...other } = education.educations[0];
      return {
        ...user_education.dataValues,
        university_name: other.dataValues.university_name,
      };
      // return result
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  updateEducationUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let education;
    try {
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        const { user_id, id, ...other } = req.body;
        await User_Education.update(
          {
            ...other,
          },
          {
            where: {
              id: id,
            },
          }
        );
        education = await UserProfiles.findOne({
          attributes: [],
          where: {
            id: req.body.user_id ?? decoded.id,
          },
          include: [
            {
              // attributes: [],
              model: Universities,
              as: "educations",
              // attributes: [],
              through: {
                model: User_Education,
                where: {
                  user_id: req.body.user_id ?? decoded.id,
                  education_id: other.education_id,
                  country_id: other.country_id,
                },
                attributes: [
                  "id",
                  "user_id",
                  "education_id",
                  "createdAt",
                  "updatedAt",
                  "degree",
                  "start_year",
                  "end_year",
                  "country_id",
                ],
                order: [["updatedAt", "DESC"]],
                // order: [["updatedAt", "DESC"]],
              },
            },
          ],
        });
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      } else if (checkRole === 0) {
        throw new ClientError("You  are not allowed to do this action.");
      }
      const { user_education, ...other } = education.educations[0];
      return {
        ...user_education.dataValues,
        university_name: other.dataValues.university_name,
      };
    } catch (err) {
      throw err;
    }
  },

  deleteEducationUser: async (req, res) => {
    try {
      let education = {};
      const decoded = jwt_decode(req.headers.authorization);
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.id,
        UserProfiles
      );
      if (checkRole === 1) {
        education = await User_Education.destroy({
          where: {
            id: req.body.id,
          },
        });
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      } else if (checkRole === 0) {
        throw new ClientError("You  are not allowed to do this action.");
      }
      return education;
    } catch (err) {
      throw err;
    }
  },

  getAllEducationUser: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const user_educations = await UserProfiles.findOne({
        attributes: [],
        where: {
          id: req.body.user_id ?? decoded.id,
        },
        include: [
          {
            // attributes: [],
            model: Universities,
            as: "educations",
            // attributes: [],
            through: {
              model: User_Education,
              where: {
                user_id: req.body.user_id ?? decoded.id,
              },
              attributes: [
                "id",
                "user_id",
                "education_id",
                "createdAt",
                "updatedAt",
                "degree",
                "start_year",
                "end_year",
                "country_id",
              ],
              order: [["updatedAt", "DESC"]],
              // order: [["updatedAt", "DESC"]],
            },
          },
        ],
      });

      let response = [];
      response = user_educations?.educations?.map((edu) => {
        const { user_education, ...other } = edu.dataValues;
        return {
          ...user_education.dataValues,
          university_name: other.university_name,
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  },

  getlistUniByCountry: async (req, res) => {
    try {
      const listUni = await Countries.findOne({
        attributes: [],
        where: {
          id: req.body.country_id,
        },
        include: [
          {
            model: Universities,
            as: "educations",
            attributes: {
              exclude: ["country_id"],
            },
          },
        ],
      });
      return listUni;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = EducationService;
