let SocketId_UserID = []
let socketState = true
const pushUserOnline = (user_info) => {
    SocketId_UserID.push(user_info)
    console.log('SocketId_UserID', SocketId_UserID)
    // return SocketId_UserID
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

const validateSocket = (socket_id) => {
    const indexSocket = SocketId_UserID.findIndex(a => a.socket_id === socket_id)
    if(indexSocket === -1) {
        return false
    } else {
        return true
    }
}

const findIndexUser = (user) => {
    const index = SocketId_UserID.findIndex((globalVar) => user.id === globalVar.user_id)
    return index
}

const addUserInfo = (user_id, socket_id) => {
    const index = SocketId_UserID.findIndex((globalVar) => user_id === globalVar.user_id)
    if(index === -1) {
        SocketId_UserID.push({user_id: user_id, socket_id: socket_id})
        // changeSocketState()
        console.log('SocketId_UserID', SocketId_UserID)
    }
}

const changeSocketState = () => {
    socketState = !socketState
    return socketState
}

const getSocketState = () => {
    return socketState
}
module.exports = {pushUserOnline, removeUserOnline, getUserOnline, findUser, findIndexUser, addUserInfo, changeSocketState, getSocketState, validateSocket}