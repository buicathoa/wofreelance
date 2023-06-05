const userSocket = require('./userSocket')

const onConnection = (socket, io) => {
    const user_spaces = io.of('/login')
    const user_space = socket.nsp;
    console.log('o login')
    user_spaces.on("disconnect", function () {});
    userSocket(socket, io);
}

module.exports = onConnection