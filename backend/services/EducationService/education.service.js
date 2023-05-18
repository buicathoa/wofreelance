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
const User_Education = db.user_educations
const Universities = db.universities

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const EducationService = {
  createEducationUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    let newEducation;
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
          end_year: req.body.end_year
        })
        // newEducation = await User_Education.create({ ...req.body, user_id: req.body.user_id ?? decoded.id });
        // if (newEducation) {
        //   await User_Education.create({
        //     user_id: req.body.user_id ?? decoded.id,
        //     experience_id: newEducation.id,
        //   });
        // }
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403);
      } else if (checkRole === 2) {
        throw new ClientError("Bad request.");
      }
      await transaction.commit();
      return newEducation;
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
        const {user_id, id, ...other} = req.body
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
          where: {
            id: user_id ?? decoded.id
          },
          include: [
            {
              model: Universities,
              where: {
                id: other.education_id
              },
              through: {
                attributes: []
              },
              as: 'educations',
              include: [
                {
                  model: Countries,
                  as: 'country'
                }
              ]
            },
          ]
        })
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
            model: Universities,
            as: 'educations',
            attributes: [
              [
                sequelize.literal(
                  "(select wofreelance.user_educations.id from wofreelance.user_educations where education_id = wofreelance.educations.id)"
                ),
                "id",
              ],
              'university_name',
              // 'id',
              [
                sequelize.literal(
                  "(select wofreelance.user_educations.degree from wofreelance.user_educations where education_id = wofreelance.educations.id)"
                ),
                "degree",
              ],
              [
                sequelize.literal(
                  "(select wofreelance.user_educations.start_year from wofreelance.user_educations where education_id = wofreelance.educations.id)"
                ),
                "start_year",
              ],
              [
                sequelize.literal(
                  "(select wofreelance.user_educations.end_year from wofreelance.user_educations where education_id = wofreelance.educations.id)"
                ),
                "end_year",
              ]
            ],
            through: {
              attributes: []
            },
          },
        ],
        // through: {
        //   attributes: ['id']
        // }
      });
      return user_educations.educations;
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
            as: "universities",
            attributes: {
              exclude: ['country_id']
            }
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
