const CONSTANT = require("../constants");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");
const myEmitter = require("../myEmitter");
const { findIndexUser, findUser } = require("../globalVariable");
const UserProfile = db.userprofile;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Skillset = db.jobskillset;
const sequelize = db.sequelize;

module.exports = (socket, io) => {
  const { NEW_POST_NOTIFY, NEW_POST_NOTIFY_RESPONSE } = CONSTANT.WS_EVENT;

  myEmitter.on(NEW_POST_NOTIFY, async (data) => {
    let transaction = await sequelize.transaction();
    try {
      const skills = data.skills.map((skill) => {
        return skill.value;
      });
      
      const skills_name = data.skills.map(skill => {
        return skill.label
      })
      //push recrod to notifications table
      const notifications = await Notifications.create({
        noti_type: 'post',
        noti_title: data.title,
        noti_content: `${data.project_detail}: ${skills_name.join(', ')}`,
        noti_url: data.post_url,
      });

      //update noti_count to one more

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
                [Op.in]: skills
              }
            },
            through: {},
          },
        ],
      });

      //add notification type not_received to each user who were found in prev step
      userMatchingSkills.forEach( (user) => {
         User_Notifications.create({
          notification_id: notifications.id,
          user_id: user.id,
          noti_status: "received",
        });

        //finding Online Users
        const indexUserOnline = findIndexUser(user)
        if(indexUserOnline !== -1) {
            const userOnl = findUser(user.id)
            console.log('userOnl', userOnl)
           socket.broadcast.to(userOnl.socket_id).emit("new_post_notify_response", data);
        }
      });

      // send notification to online user
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  });
};
