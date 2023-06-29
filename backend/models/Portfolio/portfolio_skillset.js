'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portfolio_Skillset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Portfolio_Skillset.init({
    portfolio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'portfolios',
        key: 'id'
      }
    },
    skillset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobskillsets',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Portfolio_Skillset',
  });
  return Portfolio_Skillset;
};