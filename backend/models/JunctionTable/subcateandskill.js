'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SUBCATEandSKILL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SUBCATEandSKILL.init({
    skillset_id: DataTypes.INTEGER,
    subcategory_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SUBCATEandSKILL',
  });
  return SUBCATEandSKILL;
};