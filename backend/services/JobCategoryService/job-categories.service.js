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
const jobskillset = db.jobskillset;
const JobSubCategoriesAndSkillsets = db.subcategory_skillset;
const SkillsetandPosts = db.skillsetandposts;
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
            model: JobSubCategories,
            as: "subcategories",
          },
        ],
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  //sub-categories

  createSubCategory: async (req, res) => {
    let listRecords = [];
    let listInserted = [];
    if (req.body.name.split(".")?.length > 0) {
      req?.body?.name?.split(".")?.forEach((item) => {
        listRecords.push({
          name: item.trim(),
          category_id: req.body.category_id,
          createdAt: req.body.createdAt,
          updatedAt: req.body.updatedAt,
        });
      });
    }
    try {
      const result = await JobSubCategories.bulkCreate(listRecords);
      return result;
    } catch (err) {
      throw err;
    }
  },

  updateSubCategory: async (req, res) => {
    try {
      let result;
      await sequelize.transaction(async (t) => {
        await JobSubCategories.update(
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

        result = await JobSubCategories.findOne({
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

  deleteSubCategory: async (req, res) => {
    try {
      const result = await JobSubCategories.destroy({
        where: {
          id: req.body.id,
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllSubCategory: async (req, res) => {
    try {
      const result = await SubCategoriesandSkillset.findAll({
        include: [
          {
            model: jobskillset,
            as: "list_skills",
            attributes: ["name"],
            through: { attributes: ["skillset_id"] },
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
      // const result = await JobSkillsetCategories.create(req.body)
      // return result

      //solution 2
      const table = "wofreelance.jobskillsets";
      const column = Object.keys(req.body);
      const query = RestApiMethods.insert(table, column);
      const promises = [];
      for (let record of listRecords) {
        const result = await sequelize.query(query, { replacements: record }); // The first query
        const promise = await sequelize.query(
          `select * from ${table} where id = "${result[0]}"`
        );
        promises.push(promise);
      }
      const listInserted = [];
      await Promise.all(promises).then((res) => {
        if (res?.length > 0) {
          res?.map((x) => {
            listInserted.push(x[0][0]);
          });
        }
      });
      return listInserted;
    } catch (err) {
      throw err;
    }
  },

  getAllSkillset: async (req, res) => {
    try {
      //first solution
      const result = await jobskillset.findAll();
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllSubcategoryandSkillset: async (req, res) => {
    try {
      const result = await JobSubCategories.findAll({
        include: [
          {
            model: jobskillset,
            attributes: ['id', 'name'],
            through: {
              attributes: []
            }
          },
        ],
      });
      return result;
    } catch (err) {
      throw err;
    }
  },
  getAllSkillsetForNewFreelance: async (req, res) => {
    try {
      const results = await JobCategories.findAndCountAll({
        include: [
          {
            model: jobskillset,
            as: 'list_skills',
            attributes: [
              'id',
              'name',
              [sequelize.literal('(select count(wofreelance.post_skillsets.id) from wofreelance.post_skillsets where skillset_id = wofreelance.list_skills.id)'), 'job_matching_count']
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
};

module.exports = JobCategoryService;
