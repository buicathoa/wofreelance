
const CONSTANT = require("../constants")
const db = require("../models");
const jwt_decode = require("jwt-decode");

const UserProfile = db.userprofile

module.exports = (socket, io) => {
  const {TOKEN, USER_INFO} = CONSTANT.WS_EVENT;
  socket.on(TOKEN, async(token) => {
    const decoded = jwt_decode(token)
     const user = await UserProfile.findOne({
      where: {
        id: decoded.id
      }
    })
    await socket.join(`user_id_${user.id}`)
    await io.to(`user_id_${user.id}`).emit(USER_INFO, user)
  })
}