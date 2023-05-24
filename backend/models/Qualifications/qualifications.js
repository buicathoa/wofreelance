"use strict";
const { Model } = require("sequelize");
const dayjs = require("dayjs")
module.exports = (sequelize, DataTypes) => {
  class qualifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  qualifications.init(
    {
      certificate_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      organization_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_year: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfterStartDate(value) {
            if(value !== null){
              if(dayjs(value).isAfter(dayjs())){
                throw new Error('End day can not be larger than this moment.')
              }
            }
          },
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "userprofiles",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "qualifications",
    }
  );
  return qualifications;
};
