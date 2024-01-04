const db = require("../models");
const UserProfile = db.userprofile;
// 1 true
// 0 false
// 2 bad request

const validateRole = {
  create: async (decoded = null, user_id = null, model = null) => {
    if (user_id) {
      const user = await model.findOne({
        where: {
          id: user_id,
        },
        attributes: {
          exclude: ["referer_code"],
        },
        include: [
          {
            model: db.userroles,
            as: "role",
          },
        ],
      });
      if (user) {
        if (decoded.role?.id < user.role_id) {
          return 1;
        } else if (decoded?.role?.id === user?.role_id) {
          if (decoded?.id === user?.id) {
            return 1;
          } else {
            return 0;
          }
        } else {
          return 0; // false
        }
      } else {
        return 2; // bad request
      }
    } else {
      return 1;
    }
  },
  get: async () => {
    return 1;
  },
  modify: async (decoded = null, id = null, model = null) => {
    if(!id) {
      return 1
    } else {
      const user = await model.findOne({
        attributes: ['user_id'],
        where: {
          id: id
        }
      })
      if(decoded.id === user?.user_id) {
        return 1
      } else {
        const userFound = await UserProfile.findOne({
          attributes: ['role_id'],
          where: {
            id: user?.user_id
          },
        })
        if(userFound?.role_id < decoded.role_id) {
          return 1
        } else {
          return 0
        }
      }
    }
  },
};

module.exports = { validateRole };
