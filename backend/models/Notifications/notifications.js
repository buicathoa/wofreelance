'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notifications.init({
    noti_title: DataTypes.STRING,
    noti_type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['bid_post','assign_post', 'post']],
          msg: 'Must be bid_post or assign_post'
        }
      }
    },
    noti_content: DataTypes.STRING,
    noti_url: DataTypes.STRING,
    noti_status: {
      type: DataTypes.STRING,
      defaultValue: 'received',
      validate: {
        isIn: {
          args: [['received','read']],
          msg: 'Must be received or read'
        }
      }
    },
    user_id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notifications',
  });
  return Notifications;
};