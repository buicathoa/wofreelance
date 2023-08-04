const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError, handleSuccess } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const Currency = db.currencies;
const JobSubCategories = db.jobsubcategories;
const JobSkillset = db.jobskillset;
const UserProfile = db.userprofile;
const User_Skillset = db.user_skillset;
const Budgets = db.budgets;
const Messages = db.messages;
const Rooms = db.rooms;
const Users_Rooms = db.users_rooms

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const ChatService = {
  sendMessages: async (req, res) => {
    let result
    const transaction = await sequelize.transaction();
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const {content_type, content_text, room_id, receivers} = req.body
      let room = room_id ?? null
      const senderInfo = await UserProfile.findOne({
        attributes: ['id', 'email', 'last_name'],
        where: {
          id: decoded.id
        }
      })
      // does not have the room before
      if(!room) {
        //create the room
        const listReceiversPromises =  receivers.map( (receiver) => {
          const recordCreated =  UserProfile.findOne({
            attributes: ['id', 'email', 'last_name'],
            where: {
              id: receiver
            }
          })
          return recordCreated
        })

        const listReceivers = await Promise.all(listReceiversPromises)
        const receiversName = await listReceivers.map((item) => {
          return item.dataValues.last_name
        })
        room = await Rooms.create({
          room_name: `${senderInfo.dataValues.last_name}, ${receiversName.join(', ')}`
        })
        
        //add users to the rooms
        // 1.add sender to the room
        await Users_Rooms.create({
          user_id: senderInfo.id,
          room_id: room.id
        })
        // 2. add receivers to the room
        await listReceivers?.map(async(receiver) => {
          await Users_Rooms.create({
            user_id: receiver.dataValues.id,
            room_id: room.id
          })
        })

        //Create new messages table record
        result = await Messages.create({
          content_type: content_type,
          content_text: content_text,
          sender: decoded.id,
          room_id: room.id
        })
      } else {
        result = Messages.create({
          content_type: content_type,
          content_text: content_text,
          sender: decoded.id,
          room_id: room_id
        })
      }
      await transaction.commit()
      return result;
    } catch (err) {
      await transaction.rollback()
      throw err;
    }
  },
};

module.exports = ChatService;
