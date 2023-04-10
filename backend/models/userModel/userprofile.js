'use strict';
const {
  Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserProfile.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_verified_account: DataTypes.BOOLEAN,
    skype_username: DataTypes.STRING,
    linkedin_username: DataTypes.STRING,
    avatar: DataTypes.STRING,
    education: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    title: DataTypes.STRING,
    describe: DataTypes.STRING,
    personal_website: DataTypes.STRING,
    areas_of_expertise: DataTypes.STRING,
    yoe: DataTypes.INTEGER,
    majority: DataTypes.STRING,
    cv_uploaded: DataTypes.STRING,
    other_certifications: DataTypes.STRING,
    account_status: DataTypes.STRING,
    latest_online_time: DataTypes.STRING,
    joined: DataTypes.STRING,
    areas_of_expertise: DataTypes.STRING,
    yoe: DataTypes.INTEGER,
    majority: DataTypes.STRING,
    service_role: DataTypes.STRING,
    list_service: DataTypes.STRING,
    is_open: DataTypes.BOOLEAN,
    working_time: DataTypes.STRING,
    products_link: DataTypes.STRING,
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userroles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};