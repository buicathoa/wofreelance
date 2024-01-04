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
const CONSTANT = require("../../constants");
const myEmitter = require("../../myEmitter");
const Post = db.posts;
const Budgets = db.budgets;
const Posts_skillsets = db.post_skillsets;
const UserProfiles = db.userprofile;
const JobSkillset = db.jobskillset;
const Countries = db.countries;
const Currencies = db.currencies;
const Bidding = db.bidding

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;
const PostService = {
  createPosts: async (req, res, socket, io) => {
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
    let transaction = await sequelize.transaction();
    try {
      const { NEW_POST_NOTIFY } = CONSTANT.WS_EVENT;
      const checkRole = await validateRole.create(decoded, req.body.user_id, UserProfiles);
      let newPost
      if (checkRole === 1) {
        newPost = await Post.create(
          {
            title: title,
            project_detail: project_detail,
            project_budget: parseInt(project_budget),
            // avg_bid_unit: avg_bid_unit,
            bidding_time_end: dayjs().add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
            project_paid_type: project_paid_type,
            post_status: "open",
            post_type: post_type,
            user_id: req.body.user_id ? req.body.user_id : decoded.id,
            file: req.body.files.length > 0 ? req.body.files.map((file) => {
              return file
            }).join(', ') : null,
          },
        );
        await Post.update(
          {
            post_url: `posts/${(title).toLowerCase().replaceAll(' ', '-')}-${newPost?.id}`
          },
          {
            where: {
              id: newPost?.id
            }
          }
        )
        if (newPost) {
          let promises = [];
          for (let skill of list_skills) {
            promises.push(
              Posts_skillsets.create(
                {
                  skillset_id: skill.value,
                  post_id: newPost.id,
                },
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
      //send notification to client with socket
      await transaction.commit()
      return {...newPost.dataValues, skills: list_skills, post_url: `posts/${(title).toLowerCase().replaceAll(' ', '-')}-${newPost?.dataValues?.id}`}
      // return result
    } catch (err) {
      await transaction.rollback()
      throw err;
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const { search_list, sort, list_skills } = req.body;
      const wherePost = QueryParameter.querySearch(search_list)
      const sortPost = QueryParameter.querySort(sort)
      const result = await Post.findAll({
        where: { ...wherePost, post_status: 'open' },
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
      const checkRole = await validateRole.modify(decoded, req.body.id, Post);
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
      const checkRole = await validateRole.modify(decoded, req.body.id, Post)
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
  },

  getPostByRoute: async (req, res) => {
    try{
      const {route} = req.body;
      const decoded = jwt_decode(req.headers.authorization);

      const result = await Post.findOne({
        attributes: {
          exclude: ['project_budget', "user_id"],
          include: [
            [
              sequelize.literal(
                `(SELECT EXISTS (SELECT user_id FROM biddings WHERE biddings.user_id = ${decoded.id}))`
              ),
              "is_bid",
            ],
          ]
        },
        where: {
          post_url: {
            [Op.like]: `%${route}%`
          } 
        },
        include: [
          {
            model: JobSkillset,
            as: 'list_skills',
            attributes: ['id', 'name'],
            through: {
              attributes: []
            }
          },
          {
            model: UserProfiles,
            as: 'user',
            attributes: ['id', 'username', 'first_name', 'last_name', 'avatar_cropped', 'createdAt'],
            include: [
              {
                model: Countries,
                as: 'country',
                attributes: ['id', 'country_name', 'country_official_name']
              }
            ]
          },
          {
            model: Budgets,
            attributes: ['id', 'minimum', 'maximum', 'name', 'project_type'],
            as: 'budget',
            include: [
              {
                model: Currencies,
                as: 'currency',
                attributes: ['id', 'short_name', 'name']
              }
            ]
          },
          // {
          //   model: Bidding,
          //   as: 'biddings',
          //   include: [
          //     {
          //       model: UserProfiles,
          //       attributes: ['id', 'username', 'first_name', 'last_name', 'title', 'avatar_cropped', 'createdAt', 'user_active'],
          //       as: 'user',
          //       through: {
          //         attributes: []
          //       },
          //       include: [
          //         {
          //           model: Countries,
          //           as: 'country',
          //           attributes: ['id', 'country_name', 'country_official_name']
          //         }
          //       ]
          //     }
          //   ]
          // }
        ]
      })
      const response = {...result?.dataValues, is_bid: result?.dataValues?.is_bid === 0 ? false : true}

      return response
    } catch(err) {
      throw err;
    }
  }
};

module.exports = PostService;
