const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError, handleSuccess } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const JobCategories = db.jobcategories;
const JobSubCategories = db.jobsubcategories;
const JobSkillset = db.jobskillset;
const UserProfile = db.userprofile;
const User_Skillset = db.user_skillset
const SubCategoriesandSkillset = db.subcategoryandskillset;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const JobCategoryService = {
  createCategory: async (req, res) => {
    let result = [];
    let listRecords = [];
    req.body.name.split(".")?.forEach((item) => {
      listRecords.push({
        name: item.trim(),
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
      });
    });

    try {
      let promises = [];
      for (x of listRecords) {
        promises.push(await JobCategories.create(x));
      }

      await Promise.all(promises).then((res) => {
        result = res;
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  updateCategory: async (req, res) => {
    try {
      let result;
      //solution 1
      await sequelize.transaction(async (t) => {
        await JobCategories.update(
          {
            name: req.body.name,
          },
          {
            where: {
              id: req.body.id,
            },
            returning: true,
          }
        );

        result = await JobCategories.findOne({
          where: {
            id: req.body.id,
          },
        });
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const result = await JobCategories.destroy({
        where: {
          id: req.body.id,
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllCategory: async (req, res) => {
    try {
      const result = await JobCategories.findAll({
        include: [
          {
            model: JobSkillset,
            as: "list_skills",
          },
        ],
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  //child-categories

  createSkillsetcategory: async (req, res) => {
    let listRecords = [];
    req.body.name.split(".")?.forEach((item) => {
      listRecords.push({
        name: item.trim(),
      });
    });

    try {
      //solution 1
      const result = await JobSkillset.create(req.body)
      return result
      return listInserted;
    } catch (err) {
      throw err;
    }
  },

  getAllSkillsetForUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    try {
      const result = await UserProfile.findOne({
        attributes: [],
        where: {
          id: req.body.user_id ?? decoded.id,
        },
        include: [
          {
            model: JobSkillset,
            as: 'list_skills',
            through: {
              attributes: []
            }
          },
        ]
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  createDelSkillset: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    let result
    try {
      await User_Skillset.destroy({
        where: {
          user_id: req.body.user_id ?? decoded.id 
        }
      })

      const listPayload = []
      for(let i of req.body.list_skills) {
        listPayload.push({
          skillset_id: i.id,
          user_id: req.body.user_id ?? decoded.id
        })
      }
      await User_Skillset.bulkCreate(listPayload)
      result = await UserProfile.findOne({
        attributes: [],
        where: {
          id: req.body.user_id ?? decoded.id,
        },
        include: [
          {
            model: JobSkillset,
            as: 'list_skills'
          },
        ]
      });
      await transaction.commit()
      return result
    } catch (err) {
      await transaction.rollback()
      throw err;
    }
  },

  getAllSkillsetForNewFreelance: async (req, res) => {
    try {
      const results = await JobCategories.findAndCountAll({
        include: [
          {
            model: JobSkillset,
            as: 'list_skills',
            attributes: [
              'id',
              'name',
              [sequelize.literal('(select count(wofreelance.post_skillsets.id) from wofreelance.post_skillsets where skillset_id = wofreelance.list_skills.id)'), 'job_matching_count'],
            ],
            where: req.body.skill ? {
              name: {
                [Op.like]: `%${req.body.skill}%`
              }
            } : {}
          },
        ],
      });
      return results.rows;
    } catch (err) {
      throw err;
    }
  },

  getAllSkillset: async (req, res) => {
    try{
      const skills = await JobSkillset.findAll({
        attributes: ['id', 'name'],
        where: req.body.skill ? {
          name: {
                [Op.like]: `%${req.body.skill}%`
              }
        } : {}
        // where: {
        //   name: req.body.skill ? {
        //     [Op.like]: `%${req.body.skill}%`
        //   } : {}
        // }
      })
      return skills
    } catch (err) {
      throw err
    }
  }
};

module.exports = JobCategoryService;
