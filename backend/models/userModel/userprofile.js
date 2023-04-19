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
    facebook: DataTypes.BOOLEAN,
    linkedin: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
    education: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    title: DataTypes.STRING,
    describe: DataTypes.STRING,
    personal_website: DataTypes.STRING,
    yoe: DataTypes.INTEGER,
    cv_uploaded: DataTypes.STRING,
    other_certifications: DataTypes.STRING,
    account_status: DataTypes.STRING,
    latest_online_time: DataTypes.STRING,
    joined: DataTypes.STRING,
    is_open: DataTypes.BOOLEAN,
    working_time: DataTypes.STRING,
    username: DataTypes.STRING,
    account_type: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
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