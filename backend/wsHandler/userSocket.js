const CONSTANT = require("../constants");
const { findUser, getUserOnline, pushUserOnline, removeUserOnline } = require("../globalVariable");
const db = require("../models");
const jwt_decode = require("jwt-decode");
const {myEmitter} = require("../myEmitter");

const UserProfile = db.userprofile;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications

module.exports = (socket, io) => {
  const {
    TOKEN,
    USER_INFO,
    USER_STATUS,
    USER_SIGNIN,
    USER_SIGNOUT
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

  myEmitter.on(USER_STATUS, async (user_id) => {
    const user = findUser(user_id)
    socket.emit("user_status_result", user ? [{ ...user }] : []);
  }),

  myEmitter.on(USER_SIGNIN, async(data) => {
    pushUserOnline(data)
  })

  myEmitter.on(USER_SIGNOUT, (user_id) => {
    removeUserOnline(user_id)
  })

  setInterval(() => {
    socket.emit("user_status_result", getUserOnline());
  }, 30000);
};
