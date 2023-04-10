"use strict";
const { Model } = require("sequelize");
const db = require('..');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Review.init(
    {
      post_id: DataTypes.STRING,
      review_content: DataTypes.STRING,
      rating_stars: DataTypes.INTEGER,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.userprofile,
          key: "id",
        },
      },
      user_was_reviewed_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.userprofile,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
