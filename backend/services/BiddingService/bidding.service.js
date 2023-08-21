const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError, handleSuccess } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const QueryParameter = require("../../utils/QueryParameter");
const Currency = db.currencies;
const JobSkillset = db.jobskillset;
const UserProfile = db.userprofile;
const User_Skillset = db.user_skillset;
const Budgets = db.budgets;
const Bidding = db.bidding;
const User_Bidding = db.user_bidding;
const Posts = db.posts;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Countries = db.countries;
const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const BiddingService = {
  getAllBidding: async (req, res) => {
    const {page, limit, search_list, sorts} = req.body
    let result
    try {
      const wherePost = QueryParameter.querySearch(search_list)
      const sortPost = QueryParameter.querySort(sorts)
      const result = await Bidding.findAll({
        where: {...wherePost, post_id: req.body.post_id},
        include: [
          {
            model: UserProfile,
            as: "user",
            attributes: [
              "id",
              "username",
              "first_name",
              "last_name",
              "title",
              "avatar_cropped",
              "createdAt",
              "user_active",
            ],
            include: [
              {
                model: Countries,
                as: "country",
              },
            ],
            through: {
              model: User_Bidding,
              attributes: []
            }
          },
        ],
        limit: limit,
        offset: (page - 1) * limit,
        order: [[...sortPost]]
      })

      const totalRecord = await Bidding.count({
        where: {
          post_id: req.body.post_id
        }
      })
      const response = result?.map((bid) => {
        return {...bid.dataValues, user: bid.dataValues.user[0].dataValues}
      }) ?? []
      
      return {items: response , totalRecord: totalRecord};
    } catch (err) {
      throw err;
    }
  },

  createBidding: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    try {
      let bidding;
      let result;
      const postBidding = await UserProfile.findOne({
        attributes: ["id"],
        where: {
          id: decoded.id,
        },
        include: [
          {
            model: Bidding,
            as: "bidding",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });
      //check if user bid this post
      if (postBidding?.bidding.length > 0) {
        throw new Error("You had bid this post before");
      } else {
        //create a new bid for this post
        bidding = await Bidding.create(req.body);
        await User_Bidding.create({
          user_id: decoded.id,
          bidding_id: bidding.id,
        });

        result = await Bidding.findOne({
          where: {id: bidding.id},
          include: [
            {
              model: UserProfile,
              as: "user",
              attributes: [
                "id",
                "username",
                "first_name",
                "last_name",
                "title",
                "avatar_cropped",
                "createdAt",
                "user_active",
              ],
              include: [
                {
                  model: Countries,
                  as: "country",
                },
              ],
              through: {
                model: User_Bidding,
                attributes: []
              }
            },
          ],
        })

        //increase the noti_count in user_profiles
        const userFound = await UserProfile.findOne({
          attributes: ["username"],
          where: {
            id: decoded.id,
          },
        });

        await UserProfile.increment(
          {
            noti_count: +1,
          },
          {
            where: {
              id: req.body.user_id,
            },
          }
        );


        //Finding this post
        const postFound = await Posts.findOne({
          where: {
            id: req.body.post_id,
          },
        });

        const notifications = await Notifications.create({
          noti_type: "post",
          noti_title: `${userFound.username} bid to your post.`,
          noti_content: req?.body?.describe_proposal,
          noti_url: postFound.post_url,
        });

        await User_Notifications.create({
          notification_id: notifications.id,
          user_id: req.body.user_id,
          noti_status: "received",
        });
        await transaction.commit();
      }
      const response = {...result.dataValues, user: result.user[0].dataValues}
      return response;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  updateBidding: async (req, res) => {
    try {
      //update the bid
       await Bidding.update(
        {
          ...req.body,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );

      result = await Bidding.findOne({
        where: {id: req.body.id},
        include: [
          {
            model: UserProfile,
            as: "user",
            attributes: [
              "id",
              "username",
              "first_name",
              "last_name",
              "title",
              "avatar_cropped",
              "createdAt",
              "user_active",
            ],
            include: [
              {
                model: Countries,
                as: "country",
              },
            ],
            through: {
              model: User_Bidding,
              attributes: []
            }
          },
        ],
      })
      const response = {...result.dataValues, user: result.user[0].dataValues}
      return response;
      //
    } catch (err) {
      throw err;
    }
  },

  deleteBidding: async (req, res) => {
    try {
      await Bidding.destroy({
        where: {
          id: req.body.id,
        },
      });
      return true;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = BiddingService;
