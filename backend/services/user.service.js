const db = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleSuccess, handleError } = require("../utils/handleResponse");
const GeneralProfile = require("./../models/userModel/generalprofile");
const { request } = require("http");
const { checkRole } = require("../utils/helper");
const GeneralProfiles = db.generalprofiles;
const sequelize = db.sequelize;
const userService = {
  registerAccount: async (req, res) => {
    const { email, password, referer_code, role } = req;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const checkUser = await GeneralProfiles.findOne({
        where: {
          email: email,
        },
      });
      if (checkUser) {
        return 201;
      } else {
        newUser = await GeneralProfiles.create({
          email: email,
          password: hashed,
          referer_code: referer_code,
          is_active: true,
          role: role,
          account_status: "offline",
        });
        return newUser;
      }
    } catch (err) {
      return handleError(res, err);
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req;

    try {
      const user = await GeneralProfiles.findOne({
        where: {
          email: email,
        },
        attributes: {
          exclude: ["referer_code"],
        },
      });

      if (user) {
        if (!bcrypt.compareSync(password, user.password)) {
          return 1;
        } else {
          if (user?.is_active) {
            const accesstoken = jwt.sign(
              {
                id: user.id,
                role: user.role,
                fullname: user?.fullname,
              },
              process.env.MY_SECRET_ACCESS_KEY,
              {
                expiresIn: "24h",
              }
            );

            const userResponse = { ...user };
            delete userResponse["password"];
            return {
              message: "Login success.",
              data: userResponse.dataValues,
              token: accesstoken,
            };
          } else {
            return 2;
          }
        }
      } else {
        return 1;
      }
    } catch (err) {
      throw err;
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const result = await GeneralProfiles.findOne({
        where: {
          id: req.body.id,
        },
        attributes: {
          exclude: ["referer_code", "id", "password"],
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  updateUser: async (req, res) => {
    let result;
    try {
      await sequelize.transaction(async (t) => {
        await GeneralProfiles.update(
          req?.file?.path ? { avatar: req?.file?.path } : { ...req.body },
          {
            where: {
              id: req.body.id,
            },
            returning: true,
            transaction: t,
          }
        );
        result = await GeneralProfiles.findOne({
          where: {
            id: req.body.id
          },
          transaction: t
        })
      });
      return result
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userService;
