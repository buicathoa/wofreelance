let SocketId_UserID = []

const pushUserOnline = (user_info) => {
    SocketId_UserID.push(user_info)
    console.log('SocketId_UserID', SocketId_UserID)
    return SocketId_UserID
}

const removeUserOnline = (user_id) => {
    const array = SocketId_UserID.filter((a) => a.user_id !== user_id);
    SocketId_UserID = array;
    console.log('SocketId_UserID', SocketId_UserID)
}

const getUserOnline = () => {
    console.log('SocketId_UserID', SocketId_UserID)
    return SocketId_UserID
}

const findUser = (user_id) => {
    const userOnl = SocketId_UserID.find(a => a.user_id === user_id)
    return userOnl
}

const findIndexUser = (user) => {
    const index = SocketId_UserID.findIndex((globalVar) => user.id === globalVar.user_id)
    return index
}


module.exports = {pushUserOnline, removeUserOnline, getUserOnline, findUser, findIndexUser}