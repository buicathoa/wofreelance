'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Portfolio.init({
    description: DataTypes.STRING,
    file: DataTypes.STRING,
    summary: DataTypes.STRING,
    title: DataTypes.STRING,
    portfolio_type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['image', 'article', 'code', 'video', 'audio', 'others']]
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userprofiles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Portfolio',
  });
  return Portfolio;
};