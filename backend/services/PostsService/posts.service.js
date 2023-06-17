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
const { cloudinary } = require("../../utils/helper");
const dayjs = require("dayjs");
const Post = db.posts;
const JobSubCategories = db.jobsubcategories;
const Posts_skillsets = db.post_skillsets;
const UserProfiles = db.userprofile;
const JobSkillset = db.jobskillset;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const PostService = {
  createPosts: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    const {
      title,
      project_detail,
      project_budget,
      avg_bid_unit,
      project_paid_type,
      list_skills,
      post_type
    } = req.body;
    // const transaction = await sequelize.transaction();
    try {
      const checkRole = await validateRole.create(decoded, req.body.user_id, UserProfiles);
      await sequelize.transaction(async (t) => {
        if (checkRole === 1) {
          // const files = await cloudinary.uploader.upload(
          //   profile?.photos[0]?.value,
          //   { folder: "avatar" }
          // );

          const newPost = await Post.create(
            {
              title: title,
              project_detail: project_detail,
              project_budget: parseInt(project_budget),
              // avg_bid_unit: avg_bid_unit,
              bidding_time_start: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              bidding_time_end: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
              project_paid_type: project_paid_type,
              post_status: "pending",
              post_type: post_type,
              user_id: req.body.user_id ? req.body.user_id : decoded.id,
              file: req.files.length > 0 ? req.files.map((file) => {
                return file.path
              }).join(', ') : null
            },
            { transaction: t }
          );
          if (newPost) {
            let promises = [];
            for (let skill of JSON.parse(list_skills)) {
              promises.push(
                Posts_skillsets.create(
                  {
                    skillset_id: skill,
                    post_id: newPost.id,
                  },
                  { transaction: t }
                )
              );
            }
            await Promise.all(promises).then((res) => {
              if (res) {
                return true;
              }
            });
          }
        } else if(checkRole === 0){
          throw new ClientError("You're not allowed to do this action.", 403)
        } else if(checkRole === 2){
          throw new ClientError("Bad request.")
        }
      });
      // return result
    } catch (err) {
      throw err;
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const { search_list, sort, list_skills } = req.body;
      const wherePost = QueryParameter.querySearch(search_list)
      const sortPost = QueryParameter.querySort(sort)
      const result = await Post.findAll({
        where: { ...wherePost, post_status: 'success' },
        include: [
          {
            model: JobSkillset,
            attributes: ["name", "id"],
            as: "list_skills",
            through: {
              attributes: [],
            },
            where: list_skills.length > 0
              ? {
                  id: { [Op.in]: req.body.list_skills },
                }
              : {},
          },
        ],
        limit: req.body.limit,
        offset: (req.body.page - 1) * req.body.limit,
        group: ["id"],
        order: [[...sortPost]],
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllPersonalPost: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    try {
      const { search_list, sort, list_skills } = req.body;
      const wherePost = QueryParameter.querySearch(search_list)
      const sortPost = QueryParameter.querySort(sort)
      const result = await Post.findAll({
        where: { ...wherePost, user_id: decoded.id },
        include: [
          {
            model: JobSkillset,
            attributes: ["name", "id"],
            as: "list_skills",
            through: {
              attributes: [],
            },
            where: list_skills.length > 0
              ? {
                  id: { [Op.in]: req.body.list_skills },
                }
              : {},
          },
        ],
        limit: req.body.limit,
        offset: (req.body.page - 1) * req.body.limit,
        group: ["id"],
        order: [[...sortPost]],
      });
      return result
    } catch (err) {
      throw err;
    }
  },

  editPosts: async (req, res) => {
    const { post_status, user_id, ...others } = req.body;
    const decoded = jwt_decode(req.headers.authorization);
    let updatedRecord;
    try {
      const checkRole = await validateRole.update_delete(decoded, req.body.id, Post);
      if(checkRole === 1) {
        await sequelize.transaction(async (t) => {
          const postUpdated = await Post.update(
            {
              ...others,
            },
            {
              where: !req.body.hasOwnProperty("user_id")
                ? {
                    id: req.body.id,
                  }
                : {
                    [Op.and]: [
                      { id: req.body.id },
                      { user_id: req.body.user_id },
                    ],
                  },
              transaction: t,
            }
          );
          if (postUpdated[0] === 0) {
            throw new ClientError("Bad request", 400);
          }
          updatedRecord = await Post.findOne({
            where: { id: req.body.id },
            transaction: t,
          });
        });
      } else if(checkRole === 2) {
        throw new ClientError("Bad request", 400);
      } else if(checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403)
      }
      return updatedRecord;
    } catch (err) {
      throw err;
    }
  },

  changeStatusPost: async (req, res) => {
    const {post_status, id} = req.body;
    const decoded = jwt_decode(req.headers.authorization);
    let updatedRecord;
    try {
      const checkRole = await validateRole.update_delete(decoded, req.body.id, Post)
      if(checkRole === 1) {
        await sequelize.transaction(async (t) => {
          const postUpdated = await Post.update(
            {
              post_status: post_status,
            },
            {
              where: {
                id: id
              },
              transaction: t,
            }
          );
          if (postUpdated[0] === 0) {
            throw new ClientError("Bad request", 400);
          }
          updatedRecord = await Post.findOne({
            where: { id: req.body.id },
            transaction: t,
          });
        });
      } else if(checkRole === 2) {
        throw new ClientError("Bad request", 400);
      } else if(checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403)
      }
      return updatedRecord
    } catch (err) {
      throw err
    }
  }
};

module.exports = PostService;
