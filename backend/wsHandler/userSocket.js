const CONSTANT = require("../constants");
const { findUser, getUserOnline, pushUserOnline, removeUserOnline, addUserInfo, getSocketState } = require("../globalVariable");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const myEmitter = require("../myEmitter");

const UserProfile = db.userprofile;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications;
const Sockets = db.sockets

module.exports = (socket, io) => {
  const {
    TOKEN,
    USER_INFO,
    USER_STATUS,
    USER_SIGNIN,
    USER_SIGNOUT,
    USER_RECONNECT,
    ADD_USER_INFO,
    USERS_ONLINE
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
    addUserInfo(user_id, socket.id)
  })

  socket.on(USER_STATUS, async (user_id) => {
    const user = findUser(user_id)
    socket.emit("user_status_result", user ? [{ ...user }] : []);
  }),

  socket.on(USER_SIGNIN, async(user_id) => {
    socket.join(USERS_ONLINE)
  })

  socket.on(USER_SIGNOUT, (user_id) => {
    removeUserOnline(user_id)
  })

  socket.on(USER_RECONNECT, (token) => {
    const decoded = jwt_decode(token);
    removeUserOnline(decoded.id)
    pushUserOnline({user_id: decoded.id, socket_id: socket.id})
  })

};