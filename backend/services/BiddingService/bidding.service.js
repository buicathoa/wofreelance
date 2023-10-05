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
const AwardBid = db.bidaward;
const Bidding = db.bidding;
// const User_Bidding = db.user_bidding;
const Posts = db.posts;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Countries = db.countries;
const Budgets = db.budgets;

const myEmitter = require("../../myEmitter");
const CONSTANT = require("../../constants");

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const BiddingService = {
  getAllBidding: async (req, res) => {
    const { page, limit, search_list, sorts } = req.body;
    let result;
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const wherePost = QueryParameter.querySearch(search_list);
      const sortPost = QueryParameter.querySort(sorts);
      const result = await Bidding.findAll({
        attributes: {
          exclude: ["post_id"],
        },
        where: { ...wherePost, post_id: req.body.post_id },
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
          },
          {
            model: AwardBid,
            as: "award",
            attributes: {
              exclude: ["bidding_id"],
            },
          },
          {
            model: Posts,
            as: "post",
            attributes: ['id'],
            include: [
              {
                model: Budgets,
                as: "budget",
                attributes: ["currency_id"],
                include: [
                  {
                    model: Currency,
                    as: "currency",
                    attributes: ["name", "short_name"],
                  },
                ],
              },
            ],
          },
        ],
        limit: limit,
        offset: (page - 1) * limit,
        order: [[...sortPost]],
      });

      const totalRecord = await Bidding.count({
        where: {
          post_id: req.body.post_id,
        },
      });
      const response =
        result?.map((bid) => {
          const {post, ...other} = bid.dataValues
          return { ...other, currency_name:  post.budget.currency.name, currency_short_name: post.budget.currency.short_name};
        }) ?? [];

      return { items: response, totalRecord: totalRecord };
      // return result
    } catch (err) {
      throw err;
    }
  },

  createBidding: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    const transaction = await sequelize.transaction({ autocommit: false });
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
            where: {
              post_id: req.body.post_id,
            },
          },
        ],
      });
      //check if user bid this post
      if (postBidding?.bidding.length > 0) {
        throw new Error("You had bid this post before");
      } else {
        //create a new bid for this post
        bidding = await Bidding.create({ ...req.body, user_id: decoded.id });
        result = await Bidding.findOne({
          where: { id: bidding.id },
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
            },
          ],
        });

        //increase the noti_count in user_profiles
        const userFound = await UserProfile.findOne({
          attributes: ["username"],
          where: {
            id: decoded.id,
          },
        });

        await UserProfile.increment(
          "noti_count",
          {
            by: 1,
            where: {
              id: req.body.user_id,
            },
          },
          { transaction: transaction }
        );

        //Finding this post
        const postFound = await Posts.findOne(
          {
            where: {
              id: req.body.post_id,
            },
          },
          { transaction: transaction }
        );

        const notifications = await Notifications.create(
          {
            noti_type: "post",
            noti_title: `${userFound.username} bid to your post.`,
            noti_content: req?.body?.describe_proposal,
            noti_url: postFound.post_url,
          },
          { transaction: transaction }
        );

        await User_Notifications.create(
          {
            notification_id: notifications.id,
            user_id: req.body.user_id,
            noti_status: "received",
          },
          { transaction: transaction }
        );
      }

      // const token = req.headers.authorization?.split(" ")[1];
      // await myEmitter.emit(PROJECT_BIDDING, {
      //   user_id: req.body.user_id,
      //   post_id: req.body.post_id,
      //   url: req.body.url,
      //   describe_proposal: req.body.describe_proposal,
      //   token: token
      // })
      const response = {
        ...result.dataValues,
        user: result.user.dataValues,
      };

      await transaction.commit();
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
        where: { id: req.body.id },
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
          },
        ],
      });
      const response = {
        ...result.dataValues,
        user: result.user[0].dataValues,
      };
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

  getAllPersonalBidding: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const result = await UserProfile.findOne({
        attributes: ["id", "username"],
        where: {
          id: decoded.id,
        },
        include: [
          {
            attributes: {
              exclude: ["room_id", "post_id"],
              include: [
                [
                  sequelize.literal(
                    `(SELECT title from Posts where  Posts.id = bidding.post_id)`
                  ),
                  "post_title",
                ],
                [
                  sequelize.literal(
                    `(SELECT post_url from Posts where  Posts.id = bidding.post_id)`
                  ),
                  "post_url",
                ],
              ],
            },
            model: Bidding,
            as: "bidding",
            // through: {
            //   attributes: [],
            // },
            order: [["updatedAt", "DESC"]],
            include: [
              {
                attributes: [
                  "user_id",
                  "id",
                  "project_detail",
                  // [sequelize.literal("JSON_OBJECT('country_name', (SELECT country_name FROM Countries LEFT JOIN userprofiles ON Countries.id = userprofiles.country_id LEFT JOIN))"), 'client_info'],
                ],
                model: Posts,
                as: "post",
                include: [
                  {
                    model: JobSkillset,
                    as: "list_skills",
                    attributes: ["name"],
                    through: {
                      attributes: [],
                    },
                  },
                  {
                    model: UserProfile,
                    as: "user",
                    attributes: ["country_id"],
                    include: [
                      {
                        model: Countries,
                        as: "country",
                        attributes: ["country_name", "country_official_name"],
                      },
                    ],
                  },
                  {
                    model: Budgets,
                    as: "budget",
                    attributes: ["currency_id"],
                    include: [
                      {
                        model: Currency,
                        as: "currency",
                        attributes: ["name", "short_name"],
                      },
                    ],
                  },
                ],
              },
              {
                model: AwardBid,
                as: "award",
                attributes: {
                  exclude: ["bidding_id"],
                },
              },
            ],
          },
        ],
      });
      const responseClient = result?.bidding?.map((bid) => {
        const { post, ...restBid } = bid.dataValues;
        const { user, ...restPost } = post.dataValues;
        const { user_id, ...othersPosts } = restPost;
        const { budget, ...others } = othersPosts;
        return {
          ...restBid,
          award: restBid?.award?.dataValues ? {...restBid?.award?.dataValues, currency_name: budget?.currency?.name, currency_short_name: budget?.currency?.short_name} : null,
          client_info: {
            country_name: user?.country?.country_name,
            country_official_name: user?.country?.country_name,
          },
          post: { ...others },
        };
      });

      return responseClient;
    } catch (err) {
      throw err;
    }
  },

  createAwardBid: async (req, res) => {
    try {
      //check awardbid was created or not
      const decoded = jwt_decode(req.headers.authorization);
      let result
      const bidFound = await Bidding.findOne({
        attributes: ['user_id'],
        where: {
          id: req.body.bidding_id
        },
        include: [
          {
            model: Posts,
            as: 'post',
            attributes: ['user_id', 'id']
          }
        ]
      })

      const awardBidFound = await AwardBid.findOne({
        attributes: [],
        where: {
          bidding_id: req.body.bidding_id
        },
        include: [
          {
            model: Bidding,
            as: 'bid',
            attributes: ['user_id']
          }
        ]
      })
      // award not exist + ensure that the post belong to user = decoded.id

      // award exist + ensure that post belong to user as well + the user who bid the post !== decoded.id (remove the award-bid previous)

      // else => throw error "bid before"
      
      if(bidFound.post.user_id === decoded.id) {
        if(!awardBidFound && req.body.post_id === bidFound?.post?.id) {
          
          const allBidsBelongToPost = await Bidding.findAll({
            attributes: ['id'],
            where: {
              post_id: req.body.post_id
            }
          })
          
          await AwardBid.destroy({
            where: {
              bidding_id: {
                [Op.in]: allBidsBelongToPost?.map((bid) => bid.id)
              }
            }
          })

          result = await AwardBid.create({...req.body})

        } else {

          result = await AwardBid.update(
            {
              ...req.body
            },
            {
              where: {
                bidding_id: req.body.bidding_id
              }
            }
          )
        }
      } else {
        throw new Error("You aren't owner of the post.")
      }

      return result;
    } catch (err) {
      throw err;
    }
  },

  updateAwardBid: async (req, res) => {
    try {
      const result  = await AwardBid.update(
        req.body.project_paid_type === 'hourly' ? {
          hourly_rate: req.body.hourly_rate,
          weekly_limit: req.body.weekly_limit
        } : {
          bidding_amount: req.body.bidding_amount,
          delivered_time: req.body.delivered_time
        },
        {
          where: {
            id: req.body.id
          }
        }
      )
      return result
    } catch (err) {
      throw err
    }
  },

  deleteAwardBid: async (req, res) => {
    try {
      await AwardBid.destroy({
        where: {
          id: req.body.id
        }
      })
      return true
    } catch (err) {
      throw err
    }
  },

  acceptAwardBid: async (req, res) => {
    const transaction = await sequelize.transaction({ autocommit: false });
    try {
      await AwardBid.destroy({
        id: req.body.awardbid_id
      }, {transaction: transaction}),
      
      //find the bid to update bidding_status to success
      await Bidding.update(
        {
          bidding_status: 'success'
        },
        {
          where: {
            id: req.body.bidding_id
          }
        }, {transaction: transaction}
      )

      //find the others bid to update bidding_status to rejected
      const othersBid = await Bidding.findAll({
        where: {
          id: {
            [Op.ne]: req.body.bididng_id
          }
        }
      })

      const IdsAllOthersBid = othersBid?.dataValues?.map((bid) => {
        return bid.id
      })

      await Bidding.update(
        {
          bidding_status: 'rejected'
        },
        {
          where: {
            id: {
              [Op.in]: IdsAllOthersBid
            }
          }
        }
      )

      await transaction.commit()
      return true
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }

};

module.exports = BiddingService;
