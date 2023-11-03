'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bidding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bidding.init({
    bidding_amount: {
      type: DataTypes.INTEGER,
      allowNull: () => {
        if(this.project_paid_type === 'fixed_price') {
          return false
        }
      }
    },
    hourly_rate:{
      type: DataTypes.INTEGER,
      allowNull: () => {
        if(this.project_paid_type === 'hourly') {
          return false
        }
      }
    },
    weekly_limit: {
      type: DataTypes.FLOAT,
      allowNull: () => {
        if(this.project_paid_type === 'hourly') {
          return false
        }
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
    project_paid_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['hourly','fixed']],
          msg: 'Must be paid by hour or fixed'
        }
      }
    },
    delivered_time: {
      type: DataTypes.INTEGER,
      allowNull: () => {
        if(this.project_paid_type === 'fixed_price') {
          return false
        }
      }
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    bidding_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending','awarded', 'rejected']],
          msg: 'Args must be in pending, success or rejected'
        }
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'userprofiles',
        key: 'id'
      },
      allowNull: false
    },
    describe_proposal: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bidding',
  });
  return Bidding;
};