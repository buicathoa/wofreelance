const CONSTANT = require("../constants");
const SocketId_UserID = require("../globalVariable");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");
const UserProfile = db.userprofile;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Skillset = db.jobskillset;
const sequelize = db.sequelize;

module.exports = (socket, io) => {
  const { NEW_POST_NOTIFY, NEW_POST_NOTIFY_RESPONSE } = CONSTANT.WS_EVENT;

  socket.on(NEW_POST_NOTIFY, async (data) => {
    let transaction = await sequelize.transaction();
    try {
      const skills = data.skills.map((skill) => {
        return skill.value;
      });

      //push recrod to notifications table
      const notifications = await Notifications.create({
        noti_type: data.noti_type,
        noti_title: data.noti_title,
        noti_content: data.noti_content,
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
            through: {
              attributes: [],
              where: {
                skillset_id: {
                  [Op.in]: skills,
                },
              },
            },
          },
        ],
      });

      //add notification type not_received to each user who were found in prev step
      userMatchingSkills.forEach(async (user) => {
        await User_Notifications.create({
          notification_id: notifications.id,
          user_id: user.id,
          noti_status: "received",
        });
      });

      // finding user who are being online and matching the skills

      const userMatchingSkillsandOnline = await UserProfile.findAll({
        where: {
          id: {
            [Op.ne]: data.user_id,
          },
        },
        include: [
          // {
          //   model: UserLoggedIn,
          //   as: "user_info",
          //   where: {
          //     status: "online",
          //   },
          //   attributes: ["socket_id"],
          // },
          {
            attributes: ["id", "name"],
            model: Skillset,
            as: "list_skills",
            through: {
              attributes: [],
              where: {
                skillset_id: {
                  [Op.in]: skills,
                },
              },
            },
          },
        ],
      });
      console.log('SocketId_UserID', SocketId_UserID)
      if(userMatchingSkillsandOnline.length > 0) {
        const haha = SocketId_UserID.filter((globalVar) => userMatchingSkillsandOnline.some(userSocket => userSocket.id === globalVar.user_id))

        haha.map(async(user) => {
          // const result = await UserProfile.findOne({
          //   where:{
          //     id: user.id
          //   },
          //   include: [
          //     {
          //       model: Notifications,
          //       as: 'notifications'
          //     }
          //   ]
          // })
          // io.to(user.user_info.socket_id).emit("new_post_notify_response", data);
          // console.log('socket_id::', user.user_info.socket_id)
          console.log('socket_id', user.socket_id)
          await socket.broadcast.to(user.socket_id).emit("new_post_notify_response", data);
        })
      }
      //finding user was matching with the skills which were posted and status online
      //to push new notifications

      // const listUserOnlineMatchingSkills = await UserProfile.findAll({
      //   where: {
      //     id: {
      //       [Op.ne]: data.user_id
      //     }
      //   },
      //   attributes: ["id", "email"],
      //   include: [
      //     {
      //       model: UserLoggedIn,
      //       as: "user_info",
      //       where: {
      //         status: "online",
      //       },
      //       attributes: ['socket_id'],
      //     },
      //     {
      //       model: Notifications,
      //       as: "notifications",
      //       through: {
      //         attributes: [],
      //       },
      //       where: {
      //         noti_status: "not_received",
      //       },
      //     },
      //     {
      //       attributes: ["id", "name"],
      //       model: Skillset,
      //       as: "list_skills",
      //       through: {
      //         attributes: [],
      //         where: {
      //           skillset_id: {
      //             [Op.in]: skills,
      //           },
      //         }
      //       },
      //     },
      //   ],
      // });
      // if (listUserOnlineMatchingSkills.length > 0) {
      //   listUserOnlineMatchingSkills.forEach((user) => {
      //     if (user.notifications.length > 0) {
      //       user.notifications.forEach(async (noti) => {
      //         await Notifications.update(
      //           {
      //             noti_status: "received",
      //           },
      //           {
      //             where: {
      //               id: noti.id,
      //             },
      //           }
      //         );
      //         await socket.broadcast.to(user.user_info.socket_id).emit(NEW_POST_NOTIFY_RESPONSE, noti);
      //       });
      //     }
      //   });
      // }

      // send notification to online user
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  });
};
