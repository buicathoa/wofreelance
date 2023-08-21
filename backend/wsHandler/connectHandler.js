const jwt_decode = require("jwt-decode");
const db = require("../models");
const UserProfile = db.userprofile;
const SocketModel = db.sockets
const sequelize = db.sequelize;

module.exports = async(socket, io) => {
    const decoded = jwt_decode(socket.handshake.auth.token);
    const [created] = await SocketModel.findOrCreate({
        where: {
            user_id: decoded.id
        },
        defaults: {
            user_id: decoded.id,
            socket_id: socket.id
        }
    })
    if(!created) {
        await SocketModel.update(
            {
                socket_id: socket.id
            },
            {
                where: {
                    user_id: decoded.id
                }
            }
        )
    } else {
        await UserProfile.update(
            {
                user_active: true
            },
            {
                where: {
                    id: decoded.id
                }
            }
        )
    }

    socket.on('disconnect', async() => {
        await SocketModel.destroy({
            where: {
                user_id: decoded.id
            }
        })
        await UserProfile.update(
            {
                user_active: false
            },
            {
                where: {
                    id: decoded.id
                }
            }
        )
    })
}