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
const userService = require("../UserService/user.service");
const Notifications = db.notifications;
const User_Experiences = db.user_experiences;
const Posts_skillsets = db.post_skillsets;
const UserProfiles = db.userprofile;
const Qualifications = db.qualifications;
const User_Notifications = db.user_notifications
const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const NotificationsService = {
  getAllNotifications: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let notifications;
    try {
      const checkRole = await validateRole.create(
        decoded,
        req.body.user_id,
        UserProfiles
      );
      if (checkRole === 1) {
        notifications = await UserProfiles.findOne({
            attributes: [],
            where: {
                id: decoded.id
            },
            include: [
                {
                    model: Notifications,
                    as: 'notifications',
                    through: {
                        attributes: ['noti_status']
                    }
                },
            ]
        });
        await UserProfiles.update(
            {
                noti_count: 0,
            },
            {
                where: {
                    id: decoded.id
                }
            }
        )
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action.", 403);
      } else if (checkRole === 2) {
        throw new ClientError("Bad request.");
      }
        const result = await notifications?.notifications?.map((noti) => {
            const {User_Notifications, ...resObj} = noti.dataValues
            return {...resObj, noti_status: noti?.dataValues?.User_Notifications?.noti_status}
        });
        return result
    } catch (err) {
      throw err;
    }
  },

  updateNotification: async(req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    try{
        await User_Notifications.update(
            {
                noti_status: 'read'
            },
            {
                where: {
                    notification_id: req.body.notification_id,
                    user_id: decoded.id
                }
            }
        )
        return true
    }catch(err) {
        throw err
    }
  }
};

module.exports = NotificationsService;
