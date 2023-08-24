const CONSTANT = require("../constants");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");
const myEmitter = require("../myEmitter");
const { findIndexUser, findUser } = require("../globalVariable");
const { Socket } = require("socket.io");
const UserProfile = db.userprofile;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Rooms = db.rooms;
const Users_Rooms = db.users_rooms;
const Skillset = db.jobskillset;
const Sockets = db.sockets;
const Bidding = db.bidding;
const Messages = db.messages;

const sequelize = db.sequelize;

module.exports = (socket, io) => {
  const {
    NEW_POST_NOTIFY,
    PROJECT_BIDDING,
    PROJECT_BIDDING_RESPONSE,
    NEW_MESSAGE,
    NEW_MESSAGE_RESPONSE,
  } = CONSTANT.WS_EVENT;

  socket.on(NEW_POST_NOTIFY, async (data) => {
    let transaction = await sequelize.transaction();
    try {
      console.log(io);
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
        noti_url: data.noti_url,
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
      userMatchingSkills.forEach(async (user) => {
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
      //Find mems in room
      const countMemsinRoom = await Users_Rooms.count({
        where: {
          room_id: data.room_id,
        },
      });

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
            limit: countMemsinRoom,
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      const sender_info = await UserProfile.findOne({
        attributes: ["id", "email", "username"],
        where: {
          id: decoded.id,
        },
      });

      // filter to get users online in room
      await roomFound?.users?.map(async (user) => {
        const room = await Rooms.findOne({
          attributes: [],
          where: {
            id: data.room_id,
          },
          include: [
            {
              model: UserProfile,
              where: {
                [Op.not]: {
                  id: user.dataValues.id,
                },
              },
              as: "users",
              attributes: ["email", "username", "user_active"],
              through: {
                attributes: []
              }
            },
          ],
        });

        const userResponse = room?.dataValues?.users?.map((item) => {
          return item.dataValues
        })

        // const usersResponse = await UserProfile.findAll({
        //   attributes: ["email", "username", "user_active"],
        //   where: {
        //     [Op.not]: {
        //       id: decoded.id,
        //     },
        //   },
        // });
        const countUnreadMess = await Messages.count({
          where: {
            message_status: "received",
            receiver_id: user.dataValues.id,
          },
        });
        const messagesResponse = await roomFound?.messages?.filter(
          (mess) => mess.dataValues.receiver_id === user.dataValues.id
        )[0];
        await socket.broadcast
          .to(user.dataValues.socket.socket_id)
          .emit(NEW_MESSAGE_RESPONSE, {
            id: roomFound.id,
            room_name: roomFound.room_name,
            createdAt: roomFound.createdAt,
            updatedAt: roomFound.updatedAt,
            unread_messages: countUnreadMess,
            messages: messagesResponse,
            sender_info: sender_info.dataValues,
            users: userResponse,
          });
        //emit an event to all users online in room
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  });
};
