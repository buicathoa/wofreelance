'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BidAward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BidAward.init({
    bidding_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bidding_amount: DataTypes.INTEGER,
    hourly_rate: DataTypes.INTEGER,
    weekly_limit: DataTypes.FLOAT,
    delivered_time: DataTypes.INTEGER,
    project_paid_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'BidAward',
  });
  return BidAward;
};