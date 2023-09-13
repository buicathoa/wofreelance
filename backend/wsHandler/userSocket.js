const CONSTANT = require("../constants");
const {
  findUser,
  getUserOnline,
  pushUserOnline,
  removeUserOnline,
  addUserInfo,
  getSocketState,
} = require("../globalVariable");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const myEmitter = require("../myEmitter");
const { Op } = require("sequelize");

const UserProfile = db.userprofile;
const Rooms = db.rooms;
const Users_Rooms = db.users_rooms;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Sockets = db.sockets;

module.exports = (socket, io) => {
  const {
    TOKEN,
    USER_INFO,
    USER_STATUS,
    USER_SIGNIN,
    USER_SIGNOUT,
    USER_RECONNECT,
    ADD_USER_INFO,
    USERS_ONLINE,
    USER_AUTHEN
  } = CONSTANT.WS_EVENT;

  myEmitter.on(TOKEN, async (token) => {
    const decoded = jwt_decode(token);
    const user = await UserProfile.findOne({
      where: {
        id: decoded.id,
      },
    });
    await socket.join(`user_id_${user.id}`);
    await io.to(`user_id_${user.id}`).emit(USER_INFO, user);
  });

  socket.on(ADD_USER_INFO, (user_id) => {
    addUserInfo(user_id, socket.id);
  });

  socket.on(USER_STATUS, async (user_id) => {
    const user = findUser(user_id);
    socket.emit("user_status_result", user ? [{ ...user }] : []);
  }),
    // socket.on(USER_SIGNIN, async (user_id) => {
    //   const roomHasUsers = await Users_Rooms.findAll({
    //     attributes: ["room_id"],
    //     where: {
    //       user_id: user_id,
    //     },
    //   });

    //   const allUsersInRoomPromises = roomHasUsers.dataValues.map(async (roomId) => {
    //     return await UserProfile.findAll({
    //       attributes: ["id"],
    //       where: {
    //         id: {
    //           [Op.ne]: user_id,
    //         },
    //       },
    //       include: [
    //         {
    //           model: Rooms,
    //           attributes: [],
    //           where: {
    //             id: roomId
    //           }
    //         },
    //       ],
    //     });
    //   });

    //   const allUsersInRooms = await Promise.all(allUsersInRoomPromises)
    //   console.log(allUsersInRooms)
    // });
  socket.on(USER_AUTHEN, async(data) => {
    const decoded = jwt_decode(socket.handshake.auth.token);
    //send notice to others related
    const roomsRelated = await Users_Rooms.findAll({
      attributes: ["room_id"],
      where: {
        user_id: data.user_id,
      },
    });

    const usersPromises = await roomsRelated.map(async (roomId) => {
      return await UserProfile.findAll({
        attributes: ["id"],
        where: {
          id: {
            [Op.ne]: data.user_id,
          },
          user_active: true
        },
        include: [
          {
            model: Rooms,
            attributes: [],
            where: {
              id: roomId.room_id,
            },

            as: "rooms",
            through: {
              attributes: [],
            },
          },
          {
            model: Sockets,
            as: "socket",
          },
        ],
      });
    });

    const usersFound = await Promise.all(usersPromises);
    usersFound.map((user) => {
      user.map((u) => {
        socket.broadcast.to(u.socket.socket_id).emit("user_authen", { user_id: decoded.id, status: data.status });
      })
    });
  });

  socket.on(USER_RECONNECT, (token) => {
    const decoded = jwt_decode(token);
    removeUserOnline(decoded.id);
    pushUserOnline({ user_id: decoded.id, socket_id: socket.id });
  });
};
