'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts_skillsets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posts_skillsets.init({
    skillset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobskillsets',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
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
    modelName: 'Posts_skillsets',
    schema: 'wofreelance_junction_table'
  });
  return Posts_skillsets;
};