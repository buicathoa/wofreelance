'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_bidding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_bidding.init({
    bidding_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', //pending, success, rejected 
    },
  }, {
    sequelize,
    modelName: 'user_bidding',
  });
  return user_bidding;
};