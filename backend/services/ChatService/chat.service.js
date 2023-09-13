const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError, handleSuccess } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const QueryParameter = require("../../utils/QueryParameter");
const { default: axios } = require("axios");
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
        bidding_id,
      } = req.body;
      const decoded = jwt_decode(req.headers.authorization);
      let ownMessage;
      let roomFound;
      const listReceiversPromises = [...receivers, decoded.id].map(
        (receiver) => {
          const recordCreated = UserProfile.findOne({
            attributes: ["id", "username", "user_active", "avatar_cropped"],
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

      let room = room_id ?? null;
      const senderInfo = await UserProfile.findOne({
        attributes: ["id", "avatar_cropped", "username"],
        where: {
          id: decoded.id,
        },
      });

      const maxPosition = await Messages.findOne({
        attributes: [
          [sequelize.fn("max", sequelize.col("message_position")), "position"],
        ],
      });
      // does not have the room before
      if (!room) {
        //create the room
        const roomCreated = await Rooms.create({
          room_title: message_title,
          room_url: message_title_url,
        });

        roomFound = await Rooms.findOne({
          attributes: [
            "id",
            "createdAt",
            "updatedAt",
            "room_title",
            "room_url",
            [
              sequelize.literal(
                `(SELECT COUNT(id) FROM messages WHERE messages.message_status = 'received' AND messages.receiver_id = ${decoded.id} AND messages.room_id = ${roomCreated.id})`
              ),
              "unread_messages",
            ],
            [
              sequelize.literal(
                `(SELECT room_name from Users_Rooms where user_id = ${decoded.id} AND room_id=id)`
              ),
              "room_name",
            ],
          ],
          where: {
            id: roomCreated.id,
          },
        });

        room = roomFound.id;

        //check if not exist the room and exist bidding_id => update bidding with room_id

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

        //add users to the rooms
        // 2. add receivers to the room

        // insert new message the owner
        await Users_Rooms.create({
          user_id: senderInfo.id,
          room_id: roomFound.id,
          room_name: receiversName
            ?.filter((username) => username !== senderInfo.username)
            .join(", "),
        });
        ownMessage = await Messages.create({
          message_status: "seen",
          content_type: content_type,
          content_text: content_text,
          sender: decoded.id,
          room_id: roomFound.id,
          receiver_id: senderInfo.id,
          message_position: maxPosition.dataValues.position + 1 ?? 0,
        });

        await listReceivers
          ?.filter((item) => item.id !== decoded.id)
          ?.map(async (receiver) => {
            await Users_Rooms.create({
              user_id: receiver.dataValues.id,
              room_id: roomFound.id,
              room_name: receiversName
                ?.filter(
                  (username) => username !== receiver.dataValues.username
                )
                .join(", "),
            });
            //Create new messages table record
            await Messages.create({
              message_status: "received",
              content_type: content_type,
              content_text: content_text,
              sender: decoded.id,
              room_id: roomFound.id,
              receiver_id: receiver.id,
              message_position: maxPosition.dataValues.position + 1 ?? 0,
            });
          });
      } else {
        //find the members inside the room
        roomFound = await Rooms.findOne({
          attributes: [
            "id",
            "createdAt",
            "updatedAt",
            "room_title",
            "room_url",
            [
              sequelize.literal(
                `(SELECT COUNT(id) FROM messages WHERE messages.message_status = 'received' AND messages.receiver_id = ${decoded.id} AND messages.room_id = ${room})`
              ),
              "unread_messages",
            ],
            [
              sequelize.literal(
                `(SELECT room_name from Users_Rooms where Users_Rooms.user_id = ${decoded.id} AND Users_Rooms.room_id=${room})`
              ),
              "room_name",
            ],
          ],
          where: {
            id: room,
          },
        });

        if (!roomFound) {
          throw new Error("Room not found");
        }

        // insert new message the owner
        ownMessage = await Messages.create({
          message_status: "seen",
          content_type: content_type,
          content_text: content_text,
          sender: decoded.id,
          room_id: roomFound.id,
          receiver_id: senderInfo.id,
          message_position: maxPosition.dataValues.position + 1 ?? 0,
        });

        await listReceivers
          ?.filter((item) => item.id !== decoded.id)
          ?.map(async (receiver) => {
            await Messages.create({
              message_status: "received",
              content_type: content_type,
              content_text: content_text,
              sender: decoded.id,
              room_id: room,
              receiver_id: receiver.dataValues.id,
              message_position: maxPosition.dataValues.position + 1 ?? 0,
            });
          });
      }
      await transaction.commit();
      const { receiver_id, sender, ...others } = ownMessage.dataValues;
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
                  `(SELECT COUNT(id) FROM messages WHERE messages.message_status = 'received' AND messages.receiver_id = ${decoded.id} AND messages.room_id = rooms.id)`
                ),
                "unread_messages",
              ],
              [
                sequelize.literal(
                  `(SELECT room_name from Users_Rooms where user_id = ${decoded.id} AND room_id=rooms.id)`
                ),
                "room_name",
              ],
            ],
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
                  exclude: ["receiver_id"],
                },
                // group: ["createdAt"],
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
          "room_title",
          "room_url",
          [
            sequelize.literal(
              `(SELECT COUNT(id) FROM messages WHERE messages.message_status = 'received' AND messages.receiver_id = ${decoded.id} AND messages.room_id = ${req.body.room_id})`
            ),
            "unread_messages",
          ],
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
            model: Messages,
            where: {
              receiver_id: decoded.id,
            },
            as: "messages",
            order: [["createdAt", "DESC"]],
            limit: 1,
            attributes: [
              "id",
              "content_text",
              "content_type",
              "message_status",
              "createdAt",
              "updatedAt",
              "sender",
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
      const { page, limit, search_list, sorts } = req.body;
      const whereMessages = QueryParameter.querySearch(search_list);
      const sortMessages = QueryParameter.querySort([
        { name_field: "createdAt", sort_type: "DESC" },
      ]);
      const decoded = jwt_decode(req.headers.authorization);
      const messagesDetail = await Messages.findAll({
        where: whereMessages,
        attributes: [
          "id",
          "content_text",
          "content_type",
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
            attributes: ["id", "username", "avatar_cropped"],
            as: "sender_info",
            required: false,
          },
        ],
        order: [[...sortMessages]],
        group: ["message_position"],
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

  getUnreadMessages: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const messagesDetail = await Messages.count({
        where: {
          message_status: "received",
          receiver_id: decoded.id,
        },
      });
      return messagesDetail;
    } catch (err) {
      throw err;
    }
  },

  updateInteraction: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
    } catch (err) {}
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
              `(SELECT COUNT(id) FROM messages WHERE messages.message_status = 'received' AND messages.receiver_id = ${decoded.id} AND messages.room_id = ${req.body.room_id})`
            ),
            "unread_messages",
          ],
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
        ]
      });
      return result
    } catch (err) {
      throw err
    }
  },
};

module.exports = ChatService;
