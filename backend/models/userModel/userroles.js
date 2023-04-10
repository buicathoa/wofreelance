'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRoles.init({
    description: DataTypes.STRING,
    is_modifydata_lower_level: DataTypes.BOOLEAN,
    role_parent_id: DataTypes.INTEGER,
    role_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserRoles',
  });
  return UserRoles;
};