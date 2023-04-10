'use strict';
const {
  Model
} = require('sequelize');
const db = require('..');
module.exports = (sequelize, DataTypes) => {
  class Subcategory_Skillset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subcategory_Skillset.init({
    skillset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobskillsets',
        key: 'id'
      }
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobsubcategories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Subcategory_Skillset',
  });
  return Subcategory_Skillset;
};