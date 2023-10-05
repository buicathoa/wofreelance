const CONSTANT = require("../constants");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");
const myEmitter = require("../myEmitter");
const { findIndexUser, findUser } = require("../globalVariable");
const { Socket } = require("socket.io");
const UserProfile = db.userprofile;
const Messages_Status = db.messages_status;
const Posts = db.posts;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Rooms = db.rooms;
const Users_Rooms = db.users_rooms;
const Skillset = db.jobskillset;
const Sockets = db.sockets;
const Bidding = db.bidding;
const Messages = db.messages;
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
      const notifications = await Notifications.create({
        noti_type: "post",
        noti_title: data.title,
        noti_content: `${data.project_detail}: ${skills_name.join(", ")}`,
        noti_url: data.post_url,
      });

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
        await User_Notifications.create({
          notification_id: notifications.id,
          user_id: user.id,
          noti_status: "received",
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
    let transaction = await sequelize.transaction();
    try {
      const decoded = jwt_decode(socket.handshake.auth.token);
      //Finding user who own this post and active
      const userFound = await Sockets.findOne({
        where: {
          user_id: data.user_id,
        },
      });

      //Finding user who bid the post
      const userBid = await UserProfile.findOne({
        attributes: ["username"],
        where: {
          id: decoded.id,
        },
      });

      //Count the bid of this post
      const countBid = await Bidding.count({
        where: {
          post_id: data.post_id,
        },
      });

      await socket.broadcast
        .to(userFound?.socket_id)
        .emit(PROJECT_BIDDING_RESPONSE, {
          message:
            countBid <= 1
              ? `${
                  userBid?.username
                } bid to your post: ${data.describe_proposal.slice(0, 10)}... `
              : `${userBid.username} and ${
                  countBid - 1
                } others bid to your post`,
          url: data?.url,
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
        const userFound = await Bidding.findOne(
          {
            where: {
              id: data.bidding_id,
            },
          },
          { transaction: transaction }
        );

        const userOnline = await Sockets.findOne(
          {
            attributes: ["socket_id"],
            where: {
              user_id: userFound.dataValues.user_id,
            },
          },
          { transaction: transaction }
        );

        const bidAwarded = await BidAwarded.findOne(
          {
            // attributes: [],
            where: {
              bidding_id: data.bidding_id,
            },
            include: [
              {
                model: Bidding,
                as: "bid",
                attributes: ["id"],
                include: {
                  model: Posts,
                  attributes: ["title"],
                  as: "post",
                },
              },
            ],
          },
          { transaction: transaction }
        );

        if (userOnline?.dataValues) {
          //increase notifications of users
          const notifications = await Notifications.create(
            {
              noti_title: `Congratulations! Your bid in ${bidAwarded?.dataValues?.bid?.title}
            was awarded`,
              noti_type: "post",
              noti_content: "",
              noti_url: "insights/bids",
            },
            { transaction: transaction }
          );

          await User_Notifications.create(
            {
              notification_id: notifications.id,
              user_id: userFound?.user_id,
              noti_status: "received",
            },
            { transaction: transaction }
          );

          await socket.broadcast
            .to(userOnline?.dataValues?.socket_id)
            .emit(AWARD_BID_RESPONSE, {
              ...bidAwarded.dataValues,
              noti_url: "insights/bids",
            });
        }

        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
      }
    });
  });
};
