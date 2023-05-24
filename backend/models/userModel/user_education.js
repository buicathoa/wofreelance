'use strict';
const {
  Model
} = require('sequelize');
const dayjs = require('dayjs')
module.exports = (sequelize, DataTypes) => {
  class user_education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  user_education.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userprofiles',
        key: 'id'
      }
    },
    education_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'universities',
        key: 'id'
      }
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'countries',
        key: 'id'
      }
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_year: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if (dayjs(value).isAfter(dayjs())) {
            throw new Error('Start day can not be larger than this moment.');
          }
        },
      },
    },
    end_year: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if(value !== null){
            if (value < this.date_start) {
              throw new Error('End date must be after start date');
            } else {
              if(dayjs(value).isAfter(dayjs())){
                throw new Error('End day can not be larger than this moment.')
              }
            }
          }
        },
      },
    }
  }, {
    sequelize,
    modelName: 'user_education',
  });
  return user_education;
};