const jwt_decode = require("jwt-decode");
const db = require("../models");
const { Op } = require("sequelize");

const UserProfile = db.userprofile;
const SocketModel = db.sockets;
const Users_Rooms = db.users_rooms;
const Rooms = db.rooms;
const Sockets = db.sockets;

const sequelize = db.sequelize;

module.exports = async (socket, io) => {
  const decoded = jwt_decode(socket.handshake.auth.token);
  const [created] = await SocketModel.findOrCreate({
    where: {
      user_id: decoded.id,
    },
    defaults: {
      user_id: decoded.id,
      socket_id: socket.id,
    },
  });
  if (!created) {
    await SocketModel.update(
      {
        socket_id: socket.id,
      },
      {
        where: {
          user_id: decoded.id,
        },
      }
    );
  } else {
    await UserProfile.update(
      {
        user_active: true,
      },
      {
        where: {
          id: decoded.id,
        },
      }
    );
    await SocketModel.update(
      {
        socket_id: socket.id,
      },
      {
        where: {
          user_id: decoded.id,
        },
      }
    );
  }
    //send notice to others related
    const roomsRelated = await Users_Rooms.findAll({
      attributes: ["room_id"],
      where: {
        user_id: decoded.id,
      },
    });

    const usersPromises = await roomsRelated.map(async (roomId) => {
      return await UserProfile.findAll({
        attributes: ["id"],
        where: {
          id: {
            [Op.ne]: decoded.id,
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
        socket.broadcast.to(u.socket.socket_id).emit("user_authen", { user_id: decoded.id, status: 'login' });
      })
    });

  socket.on("disconnect", async () => {
    console.log("disconnect")
    // await SocketModel.destroy({
    //   where: {
    //     user_id: decoded.id,
    //   },
    // });
    // await UserProfile.update(
    //   {
    //     user_active: false,
    //   },
    //   {
    //     where: {
    //       id: decoded.id,
    //     },
    //   }
    // );
  });
};
