const db = require("../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../errors");
const RestApiMethods = require("../utils/QueryInsertPattern");
const UserProfile = db.userprofile;
// const ServiceProfiles = db.serviceprofiles
const sequelize = db.sequelize;
const userService = {
  registerAccount: async (req, res) => {
    const { email, password, referer_code, role, is_verified_account } = req;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const checkUser = await UserProfile.findOne({
        where: {
          email: email,
        },
      });
      if (checkUser) {
        return 201;
      } else {
        //first solution
        // newUser = await UserProfile.create({
        //   email: email,
        //   password: hashed,
        //   referer_code: referer_code,
        //   is_verified_account: is_verified_account,
        //   role: role,
        //   account_status: "offline",
        // });
        // return newUser;

        //second solution
        const insertPattern = RestApiMethods.insert("wofreelance.userprofiles", Object.keys(req))
        const inserted = await sequelize.query(insertPattern, {replacements: req})
        const user = await sequelize.query(`SELECT * FROM wofreelance.userprofiles WHERE id = "${inserted[0]}"`)
        const response = user[0][0]
        delete response['password']
        delete response['is_verified_account']
        return response
      }
    } catch (err) {
      throw err
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req;

    try {

      //first solution
      // const user = await UserProfile.findOne({
      //   where: {
      //     email: email,
      //   },
      //   attributes: {
      //     exclude: ["referer_code"],
      //   },
      // });

      //second solution
      const getPattern = `SELECT * FROM wofreelance.userprofiles WHERE email = "${req.email}"`
      const users = await sequelize.query(getPattern)
      const user = users[0][0]
      if (user) {
        if (!bcrypt.compareSync(password, user.password)) {
          return 1;
        } else {
          if (user?.is_verified_account) {
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

            delete user.password
            return {
              message: "Login success.",
              data: userResponse.dataValues ? userResponse.dataValues : user,
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
      //first solution
      // const result = await UserProfile.findOne({
      //   where: {
      //     id: req.body.id,
      //   },
      //   attributes: {
      //     exclude: ["referer_code", "id", "password"],
      //   },
      // });
      // return result;

      //second solution
      const getPattern = `SELECT * FROM wofreelance.userprofiles WHERE id = ${req.body.id}`
      const users = await sequelize.query(getPattern)
      const user = users[0][0]
      delete user['is_verified_account']
      delete user['password']
      return user
    } catch (err) {
      throw err;
    }
  },

  getAllUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    try{

      //first solution
      // const result = await UserProfile.findAll({
      //   where: decoded.role === 'super_admin' ? {
      //     id: {
      //       [Op.ne]: decoded.id
      //     }
      //   } : {role: 'user', id: {
      //     [Op.ne]: decoded.id
      //   }}
      // })
      // return result

      //second solution
      const getPattern = `SELECT * FROM wofreelance.userprofiles WHERE ${decoded.role === "super_admin" ? `id NOT IN (${decoded.id})` : `role = "user" AND id NOT IN (${decoded.id})`}`
      const users = await sequelize.query(getPattern)
      const user = users[0].map(x => {
        delete x['password']
        return x
      })
      return user
    }catch(error){
      throw error
    }
  },

  updateUser: async (req, res) => {
    let result;
    try {
      if(req?.body?.role === 'super_admin'){
        throw new ClientError("You do not have permission to perform this action", 403)
      } else {
        //first solution
        await sequelize.transaction(async (t) => {
          await UserProfile.update(
            req?.file?.path ? { avatar: req?.file?.path } : { ...req.body },
            {
              where: {
                id: req.body.id,
              },
              returning: true,
              transaction: t,
            }
          );
          result = await UserProfile.findOne({
            where: {
              id: req.body.id
            },
            transaction: t
          })
        });

        //second solution
        const columns = Object.keys(req.body)
        const values = Object.values(req.body)
        const queryUpdated = RestApiMethods.update("wofreelance.userprofiles", columns, ['id'])
        await sequelize.query(queryUpdated, {replacements: [...values, req.body['id']]})
        const getPattern = `SELECT * FROM wofreelance.userprofiles WHERE id = ${req.body.id}`
        const user = await sequelize.query(getPattern)
        const response = user[0][0]
        delete response['password']
        delete response['is_verified_account']
        return response
      }
      return result
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userService;
