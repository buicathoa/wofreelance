'use strict';
const {
  Model
} = require('sequelize');

const dayjs = require('dayjs')
module.exports = (sequelize, DataTypes) => {
  class experiences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  experiences.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_start: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        isAfterStartDate(value) {
          if (dayjs(value).isAfter(dayjs())) {
            throw new Error('Start day can not be larger than this moment.');
          }
        },
      },
    },
    date_end: {
      allowNull: true,
      type: DataTypes.DATE,
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
    },
    summary: {
      allowNull: false,
      type: DataTypes.STRING(1000)
    }
  }, {
    sequelize,
    modelName: 'experiences',
  });
  return experiences;
};