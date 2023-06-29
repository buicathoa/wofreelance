const CONSTANT = require("../constants");
const db = require("../models");
const jwt_decode = require("jwt-decode");

const UserProfile = db.userprofile;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const User_Notifications = db.user_notifications
let SocketId_UserID = require("./../globalVariable")

module.exports = (socket, io) => {
  const {
    TOKEN,
    USER_INFO,
    USER_STATUS,
  } = CONSTANT.WS_EVENT;


  socket.on(TOKEN, async (token) => {
    const decoded = jwt_decode(token);
    const user = await UserProfile.findOne({
      where: {
        id: decoded.id,
      },
    });
    await socket.join(`user_id_${user.id}`);
    await io.to(`user_id_${user.id}`).emit(USER_INFO, user);
  });

  socket.on(USER_STATUS, async (user_id) => {
    const user = SocketId_UserID.find(a => a.user_id === user_id)
    socket.emit("user_status_result", user ? [{ ...user }] : []);
  }),

  setInterval(() => {
    console.log('SocketId_UserID', SocketId_UserID)
    socket.emit("user_status_result", SocketId_UserID);
  }, 30000);
};
