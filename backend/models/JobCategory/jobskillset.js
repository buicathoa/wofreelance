'use strict';
const {
  Model, Sequelize, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobSkillset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JobSkillset.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JobSkillset',
    // freezeTableName: true
    // schema: 'wofreelance_categories'
  });
  return JobSkillset;
};