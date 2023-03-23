'use strict';
const {
  Model
} = require('sequelize');
const db = require('..');
module.exports = (sequelize, DataTypes) => {
  class subcategoryandskillset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subcategoryandskillset.init({
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
    modelName: 'subcategoryandskillset',
  });
  return subcategoryandskillset;
};