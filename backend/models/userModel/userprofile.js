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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address'
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: () => {
        if(this.account_type === 'facebook') {
          return true
        } else {
          return false
        }
      },
      // validate: {
      //   customValidator(value) {
      //     if (value === null && this.account_type === 'normal') {
      //       throw new Error("You must provide a password");
      //     }
      //   }
      // }
     },
    is_verified_account: DataTypes.BOOLEAN,
    facebook: DataTypes.BOOLEAN,
    linkedin: DataTypes.BOOLEAN,
    avatar: {
      type: DataTypes.STRING,
    },
    education: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    title: DataTypes.STRING,
    description: DataTypes.STRING(5000),
    personal_website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    yoe: DataTypes.INTEGER,
    cv_uploaded: DataTypes.STRING,
    other_certifications: DataTypes.STRING,
    account_status: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        isIn: {
          args: [['offline','online','deleted']],
          msg: 'Must be offline, online or deleted'
        },
      }
    },
    latest_online_time: DataTypes.STRING,
    joined: DataTypes.STRING,
    is_open: DataTypes.BOOLEAN,
    working_time: DataTypes.STRING,
    username: DataTypes.STRING,
    account_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['facebook', 'normal']],
          msg: 'Must be normal or facebook',
        },
      },
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userroles',
        key: 'id'
      }
    },
    country_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {
        model: 'countries',
        key: 'id'
      }
    },
    hourly_rate: {
      type: DataTypes.INTEGER,
    },
    avatar_cropped: {
      type: DataTypes.STRING
    },
    province: {
      type: DataTypes.STRING
    },
    zip_code: {
      type: DataTypes.INTEGER
    },
    address_detail: {
      type: DataTypes.STRING
    },
    ip_address: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING(1000)
    },
    noti_count: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};