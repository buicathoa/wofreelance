const CONSTANT = require("../constants");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");
const myEmitter = require("../myEmitter");
const { findIndexUser, findUser } = require("../globalVariable");
const { Socket } = require("socket.io");
const bidding = require("../models/Bidding/bidding");
const { findNotificationItem, modifyNotification } = require("../utils/helper");
const UserProfile = db.userprofile;
const Messages_Status = db.messages_status;
const Posts = db.posts;
const Notifications = db.notifications;
const Rooms = db.rooms;
const Users_Rooms = db.users_rooms;
const Skillset = db.jobskillset;
const Sockets = db.sockets;
const Bidding = db.bidding;
const Messages = db.messages;
const Budgets = db.budgets;
const Currencies = db.currencies;
// const User_Biddings = db.user_bidding;
const BidAwarded = db.bidaward;

const sequelize = db.sequelize;

module.exports = (socket, io) => {
  const {
    NEW_POST_NOTIFY,
    PROJECT_BIDDING,
    PROJECT_BIDDING_RESPONSE,
    NEW_MESSAGE,
    NEW_MESSAGE_RESPONSE,
    SEEN_MESSAGE,
    SEEN_MESSAGE_SUCCESS,
    AWARD_BID,
    AWARD_BID_RESPONSE,
  } = CONSTANT.WS_EVENT;

  socket.on(NEW_POST_NOTIFY, async (data) => {
    let transaction = await sequelize.transaction();
    try {
      const skills = data.skills.map((skill) => {
        return skill.value;
      });

      const skills_name = data.skills.map((skill) => {
        return skill.label;
      });
      //push recrod to notifications table

      // finding user matching skills except user create
      const userMatchingSkills = await UserProfile.findAll({
        where: {
          id: {
            [Op.ne]: data.user_id,
          },
        },
        attributes: ["id", "email"],
        include: [
          {
            attributes: ["id", "name"],
            model: Skillset,
            as: "list_skills",
            where: {
              id: {
                [Op.in]: skills,
              },
            },
            through: {},
          },
        ],
      });

      //add notification type received to each user who were found in prev step
      await userMatchingSkills.forEach(async (user) => {
        await Notifications.create({
          noti_type: "post",
          noti_title: data.title,
          noti_content: `${data.project_detail}: ${skills_name.join(", ")}`,
          noti_url: data.post_url,
        });

        //update noti_count to one more

        await UserProfile.increment(
          {
            noti_count: +1,
          },
          {
            where: {
              id: user.id,
            },
          }
        );

        //emit an event to all user online and matching the skills
        const userOnline = await Sockets.findOne({
          where: {
            user_id: user.id,
          },
        });
        await socket.broadcast
          .to(userOnline.socket_id)
          .emit("new_post_notify_response", data);
      });
      // send notification to online user
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  });

  socket.on(PROJECT_BIDDING, async (data) => {
    const transaction = await sequelize.transaction();
    try {
      const decoded = jwt_decode(socket.handshake.auth.token);

      //Finding user who bid the post
      const userBid = await UserProfile.findOne({
        attributes: ["username"],
        where: {
          id: decoded.id,
        },
        transaction: transaction
      });

      const postInfo = await Posts.findOne({
        attributes: ["id", "user_id", "post_url"],
        where: {
          id: data.post_id,
        },
        include: [
          {
            model: Bidding,
            as: "biddings",
            attributes: ["describe_proposal"],
            where: {
              id: data.bidding_id,
            },
          },
        ],
        transaction: transaction
      });

      //Finding user who own this post and active
      const postOwner = await Sockets.findOne({
        attributes: ["socket_id"],
        where: {
          user_id: data.user_id,
        },
        transaction: transaction
      });

      //Count the bid of this post
      const countBid = await Bidding.count({
        where: {
          post_id: data.post_id,
        },
        transaction: transaction
      });

      //increase notifications
      const notiFound = await findNotificationItem({
        noti_type: "bid_post",
        noti_url: postInfo?.post_url,
        noti_status: "received",
      });

      const notifyFound = await modifyNotification({
        noti_found: notiFound,
        noti_type: "bid_post",
        ...postInfo.dataValues,
        noti_content: postInfo?.biddings[0]?.describe_proposal,
        username: userBid?.username,
        count_bid: countBid,
      });

      //increase noti_count in userprofiles model

      await UserProfile.increment("noti_count", {
        by: 1,
        where: { id: postInfo?.user_id },
        transaction: transaction,
      });

      await socket.broadcast
        .to(postOwner?.socket_id)
        .emit(PROJECT_BIDDING_RESPONSE, {
          noti_found: notiFound,
          message: !notiFound
            ? `${
                userBid?.username
              } bid to your post: ${postInfo?.biddings[0]?.describe_proposal.slice(
                0,
                10
              )}... `
            : `${userBid.username} and ${countBid - 1} others bid to your post`,
          url: postInfo?.post_url,
          bidding_id: data?.bidding_id
        });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  });

  socket.on(NEW_MESSAGE, async (data) => {
    const transaction = await sequelize.transaction();
    // payload: room_id, content_type, content_text,
    try {
      const decoded = jwt_decode(socket.handshake.auth.token);
      //emit an event to all users online to display window chat

      const roomFound = await Rooms.findOne({
        where: {
          id: data.room_id,
        },
        include: [
          {
            model: UserProfile,
            as: "users",
            attributes: ["id"],
            where: {
              user_active: true,
              id: {
                [Op.ne]: decoded.id,
              },
            },
            through: {
              attributes: [],
            },
            include: [
              {
                model: Sockets,
                as: "socket",
              },
            ],
          },
          {
            model: Messages,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      const sender_info = await UserProfile.findOne({
        attributes: ["id", "avatar_cropped", "username"],
        where: {
          id: decoded.id,
        },
      });

      // filter to get users online in room
      await roomFound?.users?.map(async (user) => {
        const roomName = await Users_Rooms.findOne({
          attributes: ["room_name"],
          where: {
            user_id: user.dataValues.id,
            room_id: data.room_id,
          },
        });

        const room = await Rooms.findOne({
          attributes: [],
          where: {
            id: data.room_id,
          },
          include: [
            {
              model: UserProfile,
              as: "users",
              attributes: ["id", "username", "user_active", "avatar_cropped"],
              through: {
                attributes: [],
              },
              include: [
                {
                  model: Messages_Status,
                  as: "status_info",
                  attributes: [
                    "id",
                    "message_status",
                    "createdAt",
                    "updatedAt",
                  ],
                },
              ],
            },
          ],
        });

        const userResponse = room?.dataValues?.users?.map((item) => {
          return item.dataValues;
        });

        await socket.broadcast
          .to(user.dataValues.socket.socket_id)
          .emit(NEW_MESSAGE_RESPONSE, {
            id: roomFound.id,
            room_name: roomName.dataValues.room_name,
            createdAt: roomFound.createdAt,
            updatedAt: roomFound.updatedAt,
            room_title: roomFound.room_title,
            room_url: roomFound.room_url,
            // unread_messages: countUnreadMess,
            messages: {
              ...roomFound?.messages[0].dataValues,
              sender_info: sender_info.dataValues,
            },
            users: userResponse,
          });
        //emit an event to all users online in room
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  });

  socket.on(SEEN_MESSAGE, async (data) => {
    const transaction = await sequelize.transaction();
    try {
      const decoded = jwt_decode(socket.handshake.auth.token);

      const userOnl = await Rooms.findOne({
        where: {
          id: data.room_id,
        },
        include: [
          {
            model: UserProfile,
            attributes: ["id"],
            as: "users",
            where: {
              id: {
                [Op.ne]: decoded.id,
              },
            },
            include: [
              {
                model: Sockets,
                attributes: ["socket_id"],
                as: "socket",
              },
            ],
          },
        ],
      });

      await userOnl?.users?.map(async (u) => {
        await socket.broadcast
          .to(u.socket.socket_id)
          .emit(SEEN_MESSAGE_SUCCESS, data);
      });

      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  });

  socket.on(AWARD_BID, async (data) => {
    sequelize.transaction({ autocommit: false }).then(async (transaction) => {
      try {
        //Find the user who bid the post
        const allBiddings = await Bidding.findAll(
          {
            attributes: ["user_id", "id"],
            where: {
              post_id: data.post_id,
            },
            include: [
              {
                model: Posts,
                as: "post",
                attributes: ["title"],
                include: [
                  {
                    model: Budgets,
                    as: "budget",
                    attributes: ["currency_id"],
                    include: [
                      {
                        model: Currencies,
                        as: "currency",
                        attributes: ["name", "short_name"],
                      },
                    ],
                  },
                ],
              },
              {
                model: UserProfile,
                as: "user",
                attributes: ["id"],
                include: [
                  {
                    model: Sockets,
                    as: "socket",
                    attributes: ["socket_id"],
                  },
                ],
              },
            ],
          },
          { transaction: transaction }
        );

        const biddingFound = allBiddings?.find(
          (bidding) => bidding?.dataValues?.id === data?.bidding_id
        );

        //Find bid award
        const bidAwarded = await BidAwarded.findOne({
          where: {
            post_id: data.post_id,
          },
          include: [
            {
              model: Bidding,
              as: "bid",
              attributes: ["user_id", "id"],
              include: [
                {
                  model: UserProfile,
                  as: "user",
                  attributes: ["id"],
                  include: [
                    {
                      model: Sockets,
                      as: "socket",
                      attributes: ["socket_id"],
                    },
                  ],
                },
              ],
            },
          ],
        });

        const patternNotification = {
          noti_type: "assign_post",
          noti_content: "",
          noti_url: "insights/bids",
        };

        const renderNotiTitle = (status) => {
          let result = "";
          console.log(allBiddings);

          if (status === "create") {
            result = `Congratulations! Your bid in ${biddingFound?.post?.title} has been awarded`;
          } else if (status === "update") {
            result = `Your awarded in ${biddingFound?.post?.title} has been updated`;
          } else if (status === "awarded") {
            result = `Your bid in ${biddingFound?.post?.title} has been ${data?.isOwner ? 'accepted' : 'awarded'}`;
          } else {
            result = `Your awarded in ${biddingFound?.post?.title} has been ${data?.isOwner ? 'removed' : 'denied'}`;
          }
          return result;
        };

        const result =
          data?.status === "removed" || data?.status === "denied"
            ? {
                bidding_id: biddingFound?.id,
                post_title: biddingFound?.post?.title,
              }
            : {
                ...bidAwarded?.dataValues,
                currency_name: biddingFound?.post?.budget?.currency?.name,
                currency_short_name:
                  biddingFound?.post?.budget?.currency?.short_name,
                post_title: biddingFound?.post?.title,
              };

        if(data?.isOwner) {
          for (const bidding of allBiddings) {
            if (
              bidding?.id === bidAwarded?.bidding_id &&
              bidding?.user?.socket?.socket_id
            ) {
              const notiFound = await findNotificationItem({
                noti_type: "assign_post",
                noti_status: "received",
                user_id: bidAwarded?.bid?.user?.id,
              });
  
              const notifications = await modifyNotification({
                noti_found: notiFound,
                ...patternNotification,
                noti_title: renderNotiTitle(data?.status),
                user_id: bidAwarded?.bid?.user?.id,
              });
              socket.broadcast
                .to(bidding?.user?.socket?.socket_id)
                .emit(AWARD_BID_RESPONSE, {
                  ...result,
                  notification: notifications.dataValues,
                  status: data?.status,
                  noti_found: notiFound,
                });
            } else {
              if (
                (data?.previous_bidding_id &&
                  data?.previous_bidding_id === bidding?.id &&
                  bidding?.user?.socket?.socket_id) ||
                data?.status === "removed"
              ) {
                const notiFound = await findNotificationItem({
                  noti_type: "assign_post",
                  noti_status: "received",
                  user_id: bidding?.user?.id,
                });
  
                const notifications = await modifyNotification({
                  noti_found: notiFound,
                  ...patternNotification,
                  noti_title: renderNotiTitle("removed"),
                  user_id: bidding?.user?.id,
                });
  
                socket.broadcast
                  .to(bidding?.user?.socket?.socket_id)
                  .emit(AWARD_BID_RESPONSE, {
                    ...result,
                    notification: notifications.dataValues,
                    status: "removed",
                    noti_found: notiFound,
                  });
              }
            }
          }
        } else {
          const postOwner = await Posts.findOne({
            attributes: [],
            where: {
              id: data?.post_id
            },
            include: [
              {
                model: UserProfile,
                as: 'user',
                attributes: ['id'],
                include: [
                  {
                    model: Sockets,
                    as: 'socket',
                    attributes: ['socket_id']
                  }
                ]
              }
            ]
          })

          const notiFound = await findNotificationItem({
            noti_type: "assign_post",
            noti_status: "received",
            user_id: data?.status !== 'removed' && data?.status !== 'awarded' ? bidAwarded?.bid?.user?.id : postOwner?.user?.id,
          });

          const notifications = await modifyNotification({
            noti_found: notiFound,
            ...patternNotification,
            noti_title: renderNotiTitle(data?.status),
            user_id: data?.status !== 'removed' && data?.status !== 'awarded' ? bidAwarded?.bid?.user?.id : postOwner?.user?.id,
          });

          socket.broadcast
                .to(postOwner?.user?.socket?.socket_id)
                .emit(AWARD_BID_RESPONSE, {
                  ...result,
                  notification: notifications.dataValues,
                  status: data?.status,
                  noti_found: notiFound,
                });
        }

        await transaction.commit();
      } catch (err) {
        console.log('err ne', err)
        await transaction.rollback();
      }
    });
  });
};
