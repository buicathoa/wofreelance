'use strict';
const {
  Model
} = require('sequelize');
const db = require('..');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    title: DataTypes.STRING,
    project_detail: DataTypes.STRING,
    project_budget: DataTypes.FLOAT,
    bidding_time_start: DataTypes.DATE,
    bidding_time_end: DataTypes.DATE,
    project_paid_type: DataTypes.STRING,
    post_status: DataTypes.STRING, //not_received: nhận được thông báo nhưng chưa bấm vào chuông, received: Nhận được thông báo và bấm vào chuông, seen
    file: DataTypes.STRING,
    post_type: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userprofiles',
        key: 'id'
      }
    },
    post_url: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};