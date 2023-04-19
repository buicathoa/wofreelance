'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_skillset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_skillset.init({
    skillset_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobskillsets',
        key: 'id'
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
    modelName: 'user_skillset',
  });
  return user_skillset;
};