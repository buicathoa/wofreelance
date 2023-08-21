const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError, handleSuccess } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const QueryParameter = require("../../utils/QueryParameter");
const Currency = db.currencies;
const Bidding = db.bidding;
const JobSkillset = db.jobskillset;
const UserProfile = db.userprofile;
const User_Skillset = db.user_skillset;
const Budgets = db.budgets;
const Messages = db.messages;
const Rooms = db.rooms;
const Users_Rooms = db.users_rooms;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const ChatService = {
  sendMessages: async (req, res) => {
    let result;
    const transaction = await sequelize.transaction();
    try {
      const {
        content_type,
        content_text,
        room_id,
        receivers,
        message_title,
        message_title_url,
        bidding_id
      } = req.body;
      const decoded = jwt_decode(req.headers.authorization);
      let roomName = "";
      let ownMessage;
      let roomFound
      const listReceiversPromises = [...receivers, decoded.id].map(
        (receiver) => {
          const recordCreated = UserProfile.findOne({
            attributes: ["id", "email", "username"],
            where: {
              id: receiver,
            },
          });
          return recordCreated;
        }
      );

      const listReceivers = await Promise.all(listReceiversPromises);

      const receiversName = listReceivers.map((item) => {
        return item.dataValues.username
      });

      let room = room_id ?? null;
      const senderInfo = await UserProfile.findOne({
        attributes: ["id", "email", "username"],
        where: {
          id: decoded.id,
        },
      });
      // does not have the room before
      if (!room) {
        //create the room
        roomName = receiversName?.join(', ');
        const roomCreated = await Rooms.create({
          room_name: roomName,
        });
        roomFound = roomCreated
        room = roomCreated.id;

        //check if not exist the room and exist bidding_id => update bidding with room_id

        if(bidding_id) {
          await Bidding.update(
            {
              room_id: roomCreated.id
            },
            {
              where: {
                id: bidding_id
              }
            }
          )
        }


        //add users to the rooms
        // 2. add receivers to the room

        // insert new message the owner
        await Users_Rooms.create({
          user_id: senderInfo.id,
          room_id: roomCreated.id
        })
        ownMessage = await Messages.create({
            message_status: "seen",
            content_type: content_type,
            content_text: content_text,
            message_title: message_title,
            sender: decoded.id,
            room_id: roomCreated.id,
            receiver_id: senderInfo.id,
            message_title_url: message_title_url,
        })

        await listReceivers
        ?.filter(item => item.id !== decoded.id)
        ?.map(async (receiver) => {
          await Users_Rooms.create({
            user_id: receiver.dataValues.id,
            room_id: roomCreated.id,
          });
          //Create new messages table record
          await Messages.create({
            message_status: "received",
            content_type: content_type,
            content_text: content_text,
            message_title: message_title,
            sender: decoded.id,
            room_id: roomCreated.id,
            receiver_id: receiver.id,
            message_title_url: message_title_url,
          });
        });
      } else {
        roomFound = await Rooms.findOne({
          where: {
            id: room,
          },
        });
        if (!roomFound) {
          throw new Error("Room not found");
        }
        roomName = roomFound.dataValues?.room_name;
        
        //find the members inside the room
        const memsInRoom = await Users_Rooms.count({
          where: {
            [Op.not]: {
              user_id: decoded.id
            },
            room_id: roomFound.id
          }
        })

        // insert new message the owner
        await Users_Rooms.create({
          user_id: senderInfo.id,
          room_id: roomFound.id
        })
        ownMessage = await Messages.create({
            message_status: "seen",
            content_type: content_type,
            content_text: content_text,
            message_title: message_title,
            sender: decoded.id,
            room_id: roomFound.id,
            receiver_id: senderInfo.id,
            message_title_url: message_title_url,
        })

        //insert new message for the other who inside the room

        await Messages.update(
          {
            message_status: 'seen'
          },
          {
            where: {
              message_status: "received",
              room_id: roomFound.id
            },
            order: [["createdAt", "DESC"]],
            limit: memsInRoom,
          }
        )
        
        await listReceivers
        ?.filter(item => item.id !== decoded.id)
        ?.map(async (receiver) => {
          await Messages.create({
            message_status: 'received',
            content_type: content_type,
            content_text: content_text,
            sender: decoded.id,
            message_title: message_title,
            room_id: room,
            receiver_id: receiver.dataValues.id,
            message_title_url: message_title_url,
          });
        });
      }
      await transaction.commit();
      const {receiver_id, ...others} = ownMessage.dataValues
      return {...roomFound.dataValues, messages: others};
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  getAllLatestMessages: async (req, res) => {
    try {
      const { page, limit, search_list, sorts } = req.body;
      const maxDate = await Messages.max("createdAt");
      const whereMessages = QueryParameter.querySearch(search_list);
      const sortMessages = QueryParameter.querySort(sorts);

      const decoded = jwt_decode(req.headers.authorization);

      const latestMessages = await UserProfile.findOne({
        attributes: [],
        where: {
          id: decoded.id,
        },
        include: [
          {
            model: Rooms,
            as: "rooms",

            through: {
              model: Users_Rooms,
              attributes: [],
              offset: (page - 1) * limit,
              // distinct: true,
              limit: limit,
              where: whereMessages,
              order: [[...sortMessages]],
            },
            include: [
              {
                model: Messages,
                where: {
                  receiver_id: decoded.id,
                },
                as: "messages",
                order: [["createdAt", "DESC"]],
                limit: 1,
                // distinct: true,
                attributes: {
                  exclude: ['receiver_id']
                },
                group: ["createdAt"],
                include: [
                  {
                    model: UserProfile,
                    attributes: ["id", "email", "username"],
                    as: "sender_info",
                  },
                ],
              },
              {
                model: UserProfile,
                as: "users",
                attributes: ["email", "username", "user_active"],
                where: {
                  [Op.not]: {
                    id: decoded.id,
                  },
                },
                through: {
                  attributes: [],
                },
              },
            ],
          },
        ],
      });
      const response = latestMessages?.rooms?.map((item) => {
        return {
          ...item.dataValues,
          messages: item.dataValues.messages[0] ?? {},
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  },

  getLatestMessageOfRoom: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const latestMess = await Rooms.findOne({
        where: {
          id: req.body.room_id,
        },
        include: [
          {
            model: Messages,
            where: {
              receiver_id: decoded.id
            },
            as: "messages",
            order: [["createdAt", "DESC"]],
            limit: 1,
            attributes: [
              "id",
              "content_text",
              "content_type",
              "message_title",
              "message_status",
              "createdAt",
              "updatedAt",
              "sender",
            ],
            include: [
              {
                model: UserProfile,
                attributes: ["id", "email", "username"],
                as: "sender_info",
              },
            ],
          },
          {
            model: UserProfile,
            as: "users",
            attributes: ["email", "username", "user_active"],
            where: {
              [Op.not]: {
                id: decoded.id,
              },
            },
            through: {
              attributes: [],
            },
          },
        ],
      });
      return {...latestMess.dataValues, messages: latestMess.messages[0].dataValues ?? {}};
    } catch (err) {
      throw err;
    }
  },

  getMessagesDetail: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { page, limit, search_list, sorts } = req.body;
      const whereMessages = QueryParameter.querySearch(search_list);
      const sortMessages = QueryParameter.querySort(sorts);

      const messagesDetail = await Messages.findAll({
        where: whereMessages,
        attributes: [
          "id",
          "content_text",
          "content_type",
          "message_title",
          "createdAt",
          "updatedAt",
          [
            sequelize.literal(
              "JSON_ARRAYAGG(JSON_OBJECT('id', messages.receiver_id, 'message_status', messages.message_status, 'username', (SELECT userprofiles.username FROM userprofiles WHERE userprofiles.id = messages.receiver_id)))"
            ),
            "messages_state",
          ],
        ],
        include: [
          {
            model: UserProfile,
            attributes: ["id", "email", "last_name"],
            as: "sender_info",
            required: false,
          },
        ],
        order: [[...sortMessages]],
        group: ["content_text"],
        offset: (page - 1) * limit,
        limit: limit,
      });
      await transaction.commit();
      return messagesDetail;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  updateInteraction: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
    } catch (err) {}
  },
};

module.exports = ChatService;
