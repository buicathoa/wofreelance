const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError, handleSuccess } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");
const myEmitter = require("../../myEmitter");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const QueryParameter = require("../../utils/QueryParameter");
const { default: axios } = require("axios");
const Currency = db.currencies;
const Bidding = db.bidding;
const JobSkillset = db.jobskillset;
const UserProfile = db.userprofile;
const User_Skillset = db.user_skillset;
const Messages_Status = db.messages_status;
const Messages = db.messages;
const Rooms = db.rooms;
const Users_Rooms = db.users_rooms;

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories
// const sequelizeJunctionTable = db.sequelizeJunctionTable

const ChatService = {
  sendMessages: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        content_type,
        content_text,
        room_id,
        receivers,
        message_title,
        message_title_url,
        bidding_id,
      } = req.body;
      const decoded = jwt_decode(req.headers.authorization);
      let ownMessage;
      let roomFound;
      let roomCreated;
      const listReceiversPromises = receivers.map(
        (receiver) => {
          const recordCreated = UserProfile.findOne({
            attributes: ["id", "username", "user_active", "avatar_cropped",],
            where: {
              id: receiver,
            },
          });
          return recordCreated;
        }
      );

      const listReceivers = await Promise.all(listReceiversPromises);

      const receiversName = listReceivers.map((item) => {
        return item.dataValues.username;
      });

      const senderInfo = await UserProfile.findOne({
        attributes: ["id", "avatar_cropped", "username"],
        where: {
          id: decoded.id,
        },
      });

      if (!room_id) {
        roomCreated = await Rooms.create({
          room_title: message_title,
          room_url: message_title_url,
        });
      }

      roomFound = await Rooms.findOne({
        attributes: [
          "id",
          "createdAt",
          "updatedAt",
          "room_title",
          "room_url",
        ],
        where: {
          id: room_id ?? roomCreated?.id,
        },
      });

      if (bidding_id) {
        await Bidding.update(
          {
            room_id: roomFound.id,
          },
          {
            where: {
              id: bidding_id,
            },
          }
        );
      }
      ownMessage = await Messages.create({
        content_type: content_type,
        content_text: content_text,
        sender: decoded.id,
        room_id: roomFound.id,
      });

      await listReceivers?.map(async (receiver) => {
        if (!room_id) {
          let roomName = ''
          if(receiver.id !== decoded.id) {
            roomName = receiver?.dataValues?.username
          }
          await Users_Rooms.create({
            user_id: receiver.dataValues.id,
            room_id: roomFound.id,
            room_name: receiversName
              ?.filter((username) => username !== receiver.dataValues.username)
              .join(", "),
          });
        }

        await Messages_Status.create({
          user_id: receiver.dataValues.id,
          message_id: ownMessage.id,
          message_status:
            receiver.dataValues.username === senderInfo.dataValues.username
              ? "seen"
              : "received",
          room_id: roomFound.dataValues.id
        });
      });

      // const token = (req.headers.authorization)?.split(' ')[1]
      // await myEmitter.emit('new_message', {room_id: roomFound.dataValues.id, token: token})
      const { receiver_id, sender, ...others } = ownMessage.dataValues;
      await transaction.commit();
      return {
        ...roomFound.dataValues,
        messages: { ...others, sender_info: senderInfo },
        users: listReceivers,
      };
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
        attributes: ["ip_address"],
        where: {
          id: decoded.id,
        },
        include: [
          {
            model: Rooms,
            as: "rooms",
            attributes: [
              "id",
              "createdAt",
              "updatedAt",
              "room_url",
              "room_title",
              [
                sequelize.literal(
                  `(SELECT room_name from Users_Rooms where user_id = ${decoded.id} AND room_id=rooms.id)`
                ),
                "room_name",
              ],
            ],
            through: {
              model: Users_Rooms,
              attributes: ["room_id"],
              offset: (page - 1) * limit,
              // distinct: true,
              limit: limit,
              where: whereMessages,
              order: [[...sortMessages]],
            },
            include: [
              {
                model: Messages,
                as: "messages",
                order: [["createdAt", "DESC"]],
                limit: 1,
                attributes: [
                  "id",
                  "content_type",
                  "content_text",
                  "sender",
                  "room_id",
                  "createdAt",
                  [
                    sequelize.literal(
                      `(SELECT COUNT(id) FROM messages_statuses WHERE message_status = 'received' AND user_id = ${decoded.id} AND messages.room_id = messages_statuses.room_id)`
                    ),
                    "unread_messages",
                  ],
                ],
                include: [
                  {
                    model: UserProfile,
                    attributes: ["id", "username", "avatar_cropped"],
                    as: "sender_info",
                  },
                ],
              },
              {
                model: UserProfile,
                as: "users",
                attributes: ["id", "username", "user_active", "avatar_cropped"],
                through: {
                  attributes: [],
                },
                include: [
                  {
                    model: Messages_Status,
                    as: "status_info",
                    attributes: [
                      "id",
                      "message_status",
                      "createdAt",
                      "updatedAt",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      const response = latestMessages?.rooms?.map((item) => {
        const { Users_Rooms, ...others } = item.dataValues;
        const { unread_messages, ...othersObj } = others.messages[0]?.dataValues
        return {
          ...others,
          messages: othersObj ?? {},
          unread_messages: others?.messages[0].dataValues.unread_messages
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

      const senderInfo = await UserProfile.findOne({
        attributes: ["id", "email", "username"],
        where: {
          id: decoded.id,
        },
      });

      const latestMess = await Rooms.findOne({
        attributes: [
          "id",
          "createdAt",
          "updatedAt",
          "room_url",
          "room_title",
          [
            sequelize.literal(
              `(SELECT room_name from Users_Rooms where Users_Rooms.user_id = ${decoded.id} AND room_id = ${req.body.room_id})`
            ),
            "room_name",
          ],
        ],
        where: {
          id: req.body.room_id,
        },
        include: [
          {
            model: Messages,
            as: "messages",
            order: [["createdAt", "DESC"]],
            limit: 1,
            attributes: [
              "id",
              "content_type",
              "content_text",
              "sender",
              "room_id",
              "createdAt",
              [
                sequelize.literal(
                  `(SELECT COUNT(id) FROM messages_statuses WHERE message_status = 'received' AND user_id = ${decoded.id} AND messages.room_id = room_id)`
                ),
                "unread_messages",
              ],
            ],
            include: [
              {
                model: UserProfile,
                attributes: ["id", "username", "avatar_cropped"],
                as: "sender_info",
              },
            ],
          },
          {
            model: UserProfile,
            as: "users",
            attributes: ["id", "username", "user_active", "avatar_cropped"],
            through: {
              attributes: [],
            },
            include: [
              {
                model: Messages_Status,
                as: "status_info",
                attributes: ["id", "message_status", "createdAt", "updatedAt"],
              },
            ],
          },
        ],
      });
      return {
        ...latestMess?.dataValues,
        messages: {
          ...(latestMess?.messages[0]?.dataValues ?? {}),
          sender_info: senderInfo.dataValues,
        },
      };
    } catch (err) {
      throw err;
    }
  },

  getMessagesDetail: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { page, limit, search_list, sorts, skip } = req.body;
      const whereMessages = QueryParameter.querySearch(search_list);
      const sortMessages = QueryParameter.querySort([
        { name_field: "createdAt", sort_type: "DESC" },
      ]);
      const decoded = jwt_decode(req.headers.authorization);
      const roomID = search_list?.find(item => item.name_field === 'room_id')?.value_search

      const totalMessInRoom = await Messages.count({
        where: {
          room_id: roomID
        }
      })
      const messagesDetail = await Messages.findAll({
        where: whereMessages,
        attributes: [
          "id",
          "content_text",
          "content_type",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: UserProfile,
            attributes: ["id", "username", "avatar_cropped"],
            as: "sender_info",
            required: false,
          },
          {
            model: Messages_Status,
            as: "status",
            attributes: ['id', 'message_status', 'createdAt', 'updatedAt', 'user_id'],
            include: [
              {
                model: UserProfile,
                as: 'status_info',
                attributes: ['username', 'avatar_cropped']
              }
            ]
          },
        ],
        order: [[...sortMessages]],
        offset: ((page - 1) * limit) + skip,
        limit: limit,
      });

      const result = messagesDetail?.map((mess) => {
        const {status, ...others} = mess.dataValues
        return { 
          ...others,
        }
      })
      await transaction.commit();
      return {messages: result, total: totalMessInRoom};
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  getUnreadMessages: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);

      const result = await Messages.findAll({
        attributes: [],
        include: [
          {
            attributes: ['id'],
            model: Messages_Status,
            as: 'status',
            where: {
              message_status: 'received',
              user_id: decoded.id
            }
          }
        ]
      })
      const countReturn = result?.length ?? 0
      // const messagesDetail = await Messages.count({
      //   where: {
      //     message_status: "received",
      //     receiver_id: decoded.id,
      //   },
      // });
      return countReturn;
    } catch (err) {
      throw err;
    }
  },

  getRoomDetail: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const result = await Rooms.findOne({
        attributes: [
          "id",
          "createdAt",
          "updatedAt",
          "room_url",
          "room_title",
          [
            sequelize.literal(
              `(SELECT room_name from Users_Rooms where user_id = ${decoded.id} AND room_id=${req.body.room_id})`
            ),
            "room_name",
          ],
        ],
        where: {
          id: req.body.room_id,
        },
        include: [
          {
            model: UserProfile,
            as: "users",
            attributes: ["id", "username", "user_active", "avatar_cropped"],
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
      return result;
    } catch (err) {
      throw err;
    }
  },

  seenMessage: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const messages = await Messages.findAll({
        where: {
          room_id: req.body.room_id
        }
      })

      const listMessID = messages?.map((mess) => {
        return mess.dataValues.id
      })

      await Messages_Status.update(
        {
          message_status: 'seen'
        },
        {
          where: {
            user_id: decoded.id,
            message_id: listMessID
          }
        }
      )
      return true
    } catch (err) {
      throw err
    }
  }
};

module.exports = ChatService;
