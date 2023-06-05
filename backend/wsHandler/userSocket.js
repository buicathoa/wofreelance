const CONSTANT = require("../constants");
const db = require("../models");
const jwt_decode = require("jwt-decode");

const UserProfile = db.userprofile;
const UserLoggedIn = db.user_loggedin;
module.exports = (socket, io) => {
  const {
    TOKEN,
    USER_INFO,
    USER_STATUS,
    USER_SIGNIN,
    USER_SIGNOUT,
    USER_REGISTER,
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
    const user = await UserLoggedIn.findOne({
      where: {
        user_id: user_id,
      },
    });
    if (!user) {
      socket.emit("user_status_result", [
        { user_id: user_id, status: user.status },
      ]);
    } else {
      socket.emit("user_status_result", [
        { user_id: user_id, status: user.status },
      ]);
    }
  }),
    socket.on(USER_SIGNIN, async (user_id) => {
      await UserLoggedIn.update(
        {
          user_id: user_id,
          socket_id: socket.id,
          status: "online",
        },
        {
          where: {
            user_id: user_id,
          },
        }
      );
      // let user_response = [];
      // const users = await UserLoggedIn.findAll({});
      // if (users.length > 0) {
      //   user_response = users.map((u) => {
      //     return { ...u.dataValues, status: u.status };
      //   });
      // }
      // io.emit("user_status_result", user_response);
    });

  socket.on(USER_SIGNOUT, async (user_id) => {
    await UserLoggedIn.update(
      {
        socket_id: null,
        status: "offline",
      },
      {
        where: {
          user_id: user_id,
        },
      }
    );
  });

  socket.on(USER_REGISTER, async (user_id) => {
    await UserLoggedIn.create({
      user_id: user_id,
      socket_id: socket.id,
      status: "online",
    });
  });

  setInterval(async () => {
    let user_response = [];
    const users = await UserLoggedIn.findAll({});
    if (users.length > 0) {
      user_response = users.map((u) => {
        return { ...u.dataValues, status: u.status };
      });
    }
    socket.emit("user_status_result", user_response);
  }, 30000);
};
