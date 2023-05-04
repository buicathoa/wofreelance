'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Languages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Languages.init({
    language: DataTypes.STRING,
    code: DataTypes.STRING,
    english_name: DataTypes.STRING,
    iso_639_1: DataTypes.STRING,
    iso_639_2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Languages',
  });
  return Languages;
};