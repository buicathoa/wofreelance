const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const Posts = db.posts;
const JobSubCategories = db.jobsubcategories;

const sequelize = db.sequelize;

const PostService = {
  create: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    const obj = {...req.body, post_status: 'pending', user_id: decoded.id}
    try {
      //solution 1
      //   const result = await Posts.create(req.body)
      //     return result
      //solution 2
      const table = "wofreelance.posts";
      const column = Object.keys(obj);
      const query = RestApiMethods.insert(table, column);
      const itemInserted = await sequelize.query(query, {
        replacements: {...obj},
      }); // The first query
      const itemGot = await sequelize.query(
        `select * from ${table} where id = "${itemInserted[0]}"`
      );
      return itemGot[0][0];
    } catch (err) {
      throw err;
    }
  },

  //   updateCategory: async (req, res) => {
  //     try {
  //       let result;
  //       //solution 1
  //       // await sequelize.transaction(async (t) => {
  //       //   await JobCategories.update(
  //       //     {
  //       //       name: req.body.name,
  //       //     },
  //       //     {
  //       //       where: {
  //       //         id: req.body.id,
  //       //       },
  //       //       returning: true,
  //       //     }
  //       //   );

  //       //   result = await JobCategories.findOne({
  //       //     where: {
  //       //       id: req.body.id,
  //       //     },
  //       //   });
  //       // });

  //       //solution 2
  //       const columns = Object.keys(req.body)
  //       const values = Object.values(req.body)
  //       const query = RestApiMethods.update('wofreelance.jobcategories', columns, ['id'])
  //       await sequelize.query(query,  {
  //         replacements: [...values, req.body['id']]
  //       })

  //       result = await sequelize.query(`select * from wofreelance.jobcategories where id = ${req.body.id}`)
  //       return result[0];
  //     } catch (err) {
  //       throw err;
  //     }
  //   },

  //   deleteCategory: async (req, res) => {
  //     try {
  //       //first solution
  //       // const result = await JobCategories.destroy({
  //       //   where: {
  //       //     id: req.body.id,
  //       //   },
  //       // });

  //       //second solution
  //       const columns = Object.keys(req.body)
  //       let results = []
  //       for(record of req.body.id.split('.')){
  //         const query = RestApiMethods.delete('wofreelance.jobcategories', columns, ['id'])
  //         const result = await sequelize.query(query, {replacements: [record]})
  //         results.push(result)
  //       }
  //       return results
  //     } catch (err) {
  //       throw err;
  //     }
  //   },

  //   getAllCategory: async (req, res) => {
  //     try {
  //       //first solution
  //       // const result = await JobCategories.findAll({
  //       //     include: JobSubCategories
  //       // })

  //       //const solution
  //       const result =
  //         await sequelize.query(`SELECT wofreelance.jobcategories.id, wofreelance.jobcategories.name,
  //         json_arrayagg(json_object('name', wofreelance.jobsubcategories.name, 'category_id', wofreelance.jobsubcategories.category_id,
  //         'id', wofreelance.jobsubcategories.id)) as list_sub
  //         FROM wofreelance.jobcategories
  //         LEFT JOIN wofreelance.jobsubcategories ON wofreelance.jobcategories.id = wofreelance.jobsubcategories.category_id
  //         GROUP BY  wofreelance.jobcategories.id;`);
  //       return result[0];
  //     } catch (err) {
  //       throw err;
  //     }
  //   },

  //   //sub-categories

  //   createSubCategory: async (req, res) => {
  //     let listRecords = [];
  //     let listInserted = []
  //     if (req.body.name.split(".")?.length > 0) {
  //       req?.body?.name?.split(".")?.forEach((item) => {
  //         listRecords.push({
  //           name: item.trim(),
  //           category_id: req.body.category_id,
  //           createdAt: req.body.createdAt,
  //           updatedAt: req.body.updatedAt
  //         });
  //       });
  //     }
  //     try {
  //       //first solution
  //       // const result = await JobSubCategories.bulkCreate(listRecords);
  //       // return result

  //       //second solution
  //       const columns = Object.keys(req.body)
  //       const query = RestApiMethods.insert('wofreelance.jobsubcategories', columns)
  //       const promises = []
  //       for (const record of listRecords) {
  //         const result = await sequelize.query(query, {replacements: record})
  //         const getRecordUpdated = await sequelize.query(`SELECT * FROM wofreelance.jobsubcategories WHERE id = ${result[0]}`)
  //         promises.push(getRecordUpdated)
  //       }
  //       await Promise.all(promises).then(res => {
  //         if(res?.length > 0){
  //           res?.map((x) => {
  //             listInserted.push(x[0][0])
  //           })
  //         }
  //       })
  //        return listInserted
  //     } catch (err) {
  //       throw err;
  //     }
  //   },
  //   updateSubCategory: async (req, res) => {
  //     try {
  //       //first solution
  //       // let result;
  //       // await sequelize.transaction(async (t) => {
  //       //   await JobSubCategories.update(
  //       //     {
  //       //       name: req.body.name,
  //       //     },
  //       //     {
  //       //       where: {
  //       //         id: req.body.id,
  //       //       },
  //       //       returning: true,
  //       //     }
  //       //   );

  //       //   result = await JobSubCategories.findOne({
  //       //     where: {
  //       //       id: req.body.id,
  //       //     },
  //       //   });
  //       // });
  //       // return result;

  //       //second solution
  //       const columns = Object.keys(req.body)
  //       const values = Object.values(req.body)
  //       const query = RestApiMethods.update('wofreelance.jobsubcategories', columns, ['id'])
  //       await sequelize.query(query,  {
  //         replacements: [...values, req.body['id']]
  //       })

  //       result = await sequelize.query(`select * from wofreelance.jobsubcategories where id = ${req.body.id}`)
  //       return result[0];
  //     } catch (err) {
  //       throw err;
  //     }
  //   },

  //   deleteSubCategory: async (req, res) => {
  //     try {
  //       //first solution
  //       // const result = await JobSubCategories.destroy({
  //       //   where: {
  //       //     id: req.body.id,
  //       //   },
  //       // });
  //       // return result;

  //       //second solution
  //       const query = RestApiMethods.delete('wofreelance.jobsubcategories', ['id'])
  //       const result = await sequelize.query(query, {replacements: [req.body.id]})
  //       return result
  //     } catch (err) {
  //       throw err;
  //     }
  //   },

  //   getAllSubCategory: async (req, res) => {
  //     try {
  //       //first solution
  //       // const result = await JobSubCategories.findAll();
  //       // return result;

  //       //second solution
  //       const query = `Select * from wofreelance.jobsubcategories`
  //       const result = await sequelize.query(query)
  //       return result[0]
  //     } catch (err) {
  //       throw err;
  //     }
  //   },
};

module.exports = PostService;
