'use strict';
const {
  Model
} = require('sequelize');


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
    project_detail: DataTypes.STRING(2000),
    project_paid_unit: DataTypes.STRING,
    project_budget: DataTypes.INTEGER,
    avg_bid_unit: DataTypes.FLOAT,
    bidding_time_start: DataTypes.DATE,
    bidding_time_end: DataTypes.DATE,
    project_paid_type: DataTypes.STRING, //by_task, by_feature, after_completed
    post_status: DataTypes.STRING ,//pending, verified, reject,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  
  return Post;
};
