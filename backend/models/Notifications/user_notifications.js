'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Notifications.init({
    notification_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notifications',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userprofiles',
        key: 'id'
      }
    },
    noti_status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User_Notifications',
  });
  return User_Notifications;
};