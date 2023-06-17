'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budgets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Budgets.init({
    currency_id: {
      type: DataTypes.INTEGER,
      require: true
    },
    minimum: {
      type: DataTypes.INTEGER
    },
    maximum: DataTypes.INTEGER,
    name: DataTypes.STRING,
    project_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Budgets',
  });
  return Budgets;
};