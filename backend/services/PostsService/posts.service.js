const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const dbConnection = require("../../server");
const Post = db.posts;
const JobSubCategories = db.jobsubcategories;
const Posts_skillsets = db.skillsetandposts;
const UserProfiles = db.userprofile;
const JobSkillset = db.jobskillset;

const sequelize = db.sequelize;
const sequelizeJunctionTable = db.sequelizeJunctionTable;

const PostService = {
  createPosts: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    const {
      title,
      project_detail,
      project_paid_unit,
      project_budget,
      avg_bid_unit,
      bidding_time_start,
      bidding_time_end,
      project_paid_type,
    } = req.body;
    const obj = { ...req.body, post_status: "pending", user_id: decoded.id };
    const columnPosts = Object.keys(obj);
    // const transaction = await sequelize.transaction();
    try {
      await sequelize.transaction(async (t) => {
        const newPost = await Posts.create(
          {
            title: title,
            project_detail: project_detail,
            project_paid_unit: project_paid_unit,
            project_budget: project_budget,
            avg_bid_unit: avg_bid_unit,
            bidding_time_start: bidding_time_start,
            bidding_time_end: bidding_time_end,
            project_paid_type: project_paid_type,
            post_status: "pending",
            user_id: decoded.id,
          },
          { transaction: t }
        );
        // const queryPatternPosts = RestApiMethods.insert('wofreelance.posts', columnPosts)
        // const result = await sequelize.query(queryPatternPosts,{
        //  replacements: {...obj}, transaction: t
        // })
        // const recordAdded = await sequelize.query(
        //   `SELECT * FROM wofreelance.posts WHERE id = ${result[0]}`, {transaction: t}
        // )
        let promises = [];
        const list_skills = req.body.skills.split(",");
        for (skill of list_skills) {
          const columnsSkillsandPosts = ["skillset_id", "post_id", "user_id"];
          const querySkillsAndPosts = RestApiMethods.insert(
            "wofreelance_junction_table.posts_skillsets",
            columnsSkillsandPosts
          );
          promises.push(
            await sequelizeJunctionTable.query(querySkillsAndPosts, {
              replacements: {
                skillset_id: parseInt(skill),
                post_id: newPost.id,
                user_id: decoded.id,
              },
              transaction: t,
            })
          );
        }

        await Promise.all(promises).then((res) => {
          return newPost[0];
        });
      });
      // return result
    } catch (err) {
      throw err;
    }
  },

  getAllPersonalPosts: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    // const params = {
    //   user_id: decoded.id,
    //   list_skills: req.body.list_skills
    //     ? req.body.list_skills?.split(",")?.map(Number)?.join(",")
    //     : null,
    // };
    // const json_string = JSON.stringify(params);
    try {
      // const result = await sequelizeJunctionTable.query(`CALL wofreelance_junction_table.getAllPostsByPersonal('${json_string}')`)
      // return result

      const result = await db.posts.findAll({
        include: [
          {
            model: db.jobskillset,
            through: {
              model: db.skillsetandposts,
              attributes: []
            }
          }
        ]
      });

      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = PostService;
