'use strict';
const {
  Model
} = require('sequelize');
const ServiceProfile = require('./serviceprofile');
const db = require("./../index");
module.exports = (sequelize, DataTypes) => {
  const ServiceProfile = db.generalprofiles;

  class GeneralProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GeneralProfile.init({
    email: DataTypes.STRING,
    fullname: DataTypes.STRING,
    account_status: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    referer_code: DataTypes.STRING, 
    skype_username: DataTypes.STRING,
    linkedin_username: DataTypes.STRING,
    avatar: DataTypes.STRING,
    education: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    role: DataTypes.STRING,
    title: DataTypes.STRING,
    describe: DataTypes.STRING,
    personal_website: DataTypes.STRING,
    areas_of_expertise: DataTypes.STRING,
    yoe: DataTypes.INTEGER,
    majority: DataTypes.STRING,
    cv_uploaded: DataTypes.STRING,
    other_certifications: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GeneralProfile',
  });

  return GeneralProfile;
};