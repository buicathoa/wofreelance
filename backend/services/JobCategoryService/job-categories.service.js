const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const JobCategories = db.jobcategories;
const JobSubCategories = db.jobsubcategories;
const jobskillset = db.jobskillset;
const SkillsetandPosts = db.skillsetandposts

const sequelize = db.sequelize;
const sequelizeCategories = db.sequelizeCategories
const sequelizeJunctionTable = db.sequelizeJunctionTable

const JobCategoryService = {
  createCategory: async (req, res) => {
    let listRecords = [];
    req.body.name.split(".")?.forEach((item) => {
      listRecords.push({
        name: item.trim(),
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
      });
    });

    try {
      //solution 1
      let promises = []
      for(x of listRecords) {
        promises.push(await JobCategories.create(x))
      }

      await Promise.all(promises).then(res => {
        console.log(res)
      })
      //solution 2
      // const table = "wofreelance.jobcategories";
      // const column = Object.keys(req.body);
      // const query = RestApiMethods.insert(table, column);
      // const promises = [];
      // for (let record of listRecords) {
      //   const result = await sequelize.query(query, { replacements: record }); // The first query
      //   const getMethodPattern = RestApiMethods.get(
      //     "wofreelance.jobcategories",
      //     "all",
      //     ["id"]
      //   );
      //   const promise = await sequelize.query(
      //     `select * from wofreelance.jobcategories where id = "${result[0]}"`
      //   );
      //   promises.push(promise);
      // }
      // const listInserted = [];
      // await Promise.all(promises).then((res) => {
      //   if (res?.length > 0) {
      //     res?.map((x) => {
      //       listInserted.push(x[0][0]);
      //     });
      //   }
      // });
      // return listInserted;
    } catch (err) {
      throw err;
    }
  },

  updateCategory: async (req, res) => {
    try {
      let result;
      //solution 1
      // await sequelize.transaction(async (t) => {
      //   await JobCategories.update(
      //     {
      //       name: req.body.name,
      //     },
      //     {
      //       where: {
      //         id: req.body.id,
      //       },
      //       returning: true,
      //     }
      //   );

      //   result = await JobCategories.findOne({
      //     where: {
      //       id: req.body.id,
      //     },
      //   });
      // });

      //solution 2
      const columns = Object.keys(req.body);
      const values = Object.values(req.body);
      const query = RestApiMethods.update(
        "wofreelance.jobcategories",
        columns,
        ["id"]
      );
      await sequelize.query(query, {
        replacements: [...values, req.body["id"]],
      });

      result = await sequelize.query(
        `select * from wofreelance.jobcategories where id = ${req.body.id}`
      );
      return result[0];
    } catch (err) {
      throw err;
    }
  },

  deleteCategory: async (req, res) => {
    try {
      //first solution
      // const result = await JobCategories.destroy({
      //   where: {
      //     id: req.body.id,
      //   },
      // });

      //second solution
      const columns = Object.keys(req.body);
      let results = [];
      for (record of req.body.id.split(".")) {
        const query = RestApiMethods.delete(
          "wofreelance.jobcategories",
          columns,
          ["id"]
        );
        const result = await sequelize.query(query, { replacements: [record] });
        results.push(result);
      }
      return results;
    } catch (err) {
      throw err;
    }
  },

  getAllCategory: async (req, res) => {
    try {
      //first solution
      const result = await JobCategories.findAll({
          include: JobSubCategories
      })
      return result
      //const solution
      // const result =
      //   await sequelize.query(`SELECT wofreelance_categories.jobcategories.id, wofreelance_categories.jobcategories.name,
      //   json_arrayagg(json_object('name', wofreelance_categories.jobsubcategories.name, 'category_id', wofreelance_categories.jobsubcategories.category_id,
      //   'id', wofreelance_categories.jobsubcategories.id)) as list_sub
      //   FROM wofreelance_categories.jobcategories
      //   LEFT JOIN wofreelance_categories.jobsubcategories ON wofreelance_categories.jobcategories.id = wofreelance_categories.jobsubcategories.category_id
      //   GROUP BY  wofreelance_categories.jobcategories.id;`);
      // return result[0];
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
      //first solution
      // const result = await JobSubCategories.bulkCreate(listRecords);
      // return result

      //second solution
      const columns = Object.keys(req.body);
      const query = RestApiMethods.insert(
        "wofreelance.jobsubcategories",
        columns
      );
      const promises = [];
      for (const record of listRecords) {
        const result = await sequelize.query(query, { replacements: record });
        const getRecordUpdated = await sequelize.query(
          `SELECT * FROM wofreelance.jobsubcategories WHERE id = ${result[0]}`
        );
        promises.push(getRecordUpdated);
      }
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
  updateSubCategory: async (req, res) => {
    try {
      //first solution
      // let result;
      // await sequelize.transaction(async (t) => {
      //   await JobSubCategories.update(
      //     {
      //       name: req.body.name,
      //     },
      //     {
      //       where: {
      //         id: req.body.id,
      //       },
      //       returning: true,
      //     }
      //   );

      //   result = await JobSubCategories.findOne({
      //     where: {
      //       id: req.body.id,
      //     },
      //   });
      // });
      // return result;

      //second solution
      const columns = Object.keys(req.body);
      const values = Object.values(req.body);
      const query = RestApiMethods.update(
        "wofreelance.jobsubcategories",
        columns,
        ["id"]
      );
      await sequelize.query(query, {
        replacements: [...values, req.body["id"]],
      });

      result = await sequelize.query(
        `select * from wofreelance.jobsubcategories where id = ${req.body.id}`
      );
      return result[0];
    } catch (err) {
      throw err;
    }
  },

  deleteSubCategory: async (req, res) => {
    try {
      //first solution
      // const result = await JobSubCategories.destroy({
      //   where: {
      //     id: req.body.id,
      //   },
      // });
      // return result;

      //second solution
      const query = RestApiMethods.delete("wofreelance.jobsubcategories", [
        "id",
      ]);
      const result = await sequelize.query(query, {
        replacements: [req.body.id],
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllSubCategory: async (req, res) => {
    try {
      //first solution
      const result = await JobSubCategories.findAll();
      return result;

      //second solution
      // let query = '';
      // if(req.body.getType === 'onlySub'){
      //   query = `Select * from wofreelance.jobsubcategories`
      // } else {
      //   query = `Select wofreelance.jobsubcategories.id, wofreelance.jobsubcategories.name, IF(json_arrayagg(json_object('name', wofreelance.jobskillsets.name)) IS NULL, JSON_ARRAY(), json_arrayagg(json_object('name', wofreelance.jobskillsets.name))) as list_skillsets
      //   FROM wofreelance.jobsubcategories LEFT JOIN wofreelance.jobskillsets ON wofreelance.jobsubcategories.id = wofreelance.jobskillsets.subcategory_id
      //   GROUP BY wofreelance.jobsubcategories.id`
      // }
      // const result = await sequelize.query(query);
      return result[0];
    } catch (err) {
      throw err;
    }
  },

  //child-categories

  createSkillsetcategory: async (req, res) => {
    let listRecords = [];
    req.body.name.split(".")?.forEach((item) => {
      listRecords.push({
        name: item.trim()
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

      //second solution
      // const query = `Select * from wofreelance.jobskillsets`;
      // const result = await sequelize.query(query);
      // return result[0];
    } catch (err) {
      throw err;
    }
  },

  getAllSubcategoryandSkillset: async (req, res) => {
    try {
        //first solution
        const result = await sequelizeJunctionTable.query(`call wofreelance_junction_table.SP_getallSubcateandSkillset()`)
        if(result){
          const list_array = result.map((res) => {
            return {...res, list_skills: res.list_skills.filter(x => x !== null)}
          })
          return list_array
        }
    } catch (err) {
      throw err
    }
  }

};

module.exports = JobCategoryService;
