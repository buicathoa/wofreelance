'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ServiceProfile.init({
    areas_of_expertise: DataTypes.STRING,
    yoe: DataTypes.INTEGER,
    majority: DataTypes.STRING,
    service_role: DataTypes.STRING,
    list_service: DataTypes.STRING,
    is_receive_service: DataTypes.BOOLEAN,
    working_time: DataTypes.STRING,
    products_link: DataTypes.STRING,
    latest_online_time: DataTypes.DATE,
    joined: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ServiceProfile',
  });
  return ServiceProfile;
};