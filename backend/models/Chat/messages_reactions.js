'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages_Reactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Messages_Reactions.init({
    message_id: DataTypes.STRING,
    reaction: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Messages_Reactions',
  });
  return Messages_Reactions;
};