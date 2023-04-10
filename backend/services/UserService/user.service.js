const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");
const RestApiMethods = require("../../utils/QueryInsertPattern");
const { validateRole } = require("../../utils/validateRole");
const UserProfile = db.userprofile;
const UserRole = db.userroles;
// const ServiceProfiles = db.serviceprofiles
const sequelize = db.sequelize;
const userService = {
  registerAccount: async (req, res) => {
    const { email, password, referer_code, role_id, is_verified_account } = req;
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
        newUser = await UserProfile.create({
          email: email,
          password: hashed,
          referer_code: referer_code,
          is_verified_account: is_verified_account,
          role_id: role_id,
          account_status: "offline",
        });
        return newUser;
      }
    } catch (err) {
      throw err;
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req;

    try {
      //second solution
      const user = await UserProfile.findOne({
        where: {
          email: email,
        },
        attributes: {
          exclude: ["referer_code"],
        },
        include: [
          {
            model: UserRole,
            as: "role",
          },
        ],
      });

      if (user) {
        if (!bcrypt.compareSync(password, user.password)) {
          return 1;
        } else {
          if (user?.is_verified_account) {
            const accesstoken = jwt.sign(
              {
                id: user.id,
                role: user?.role,
                email: user?.email,
                // role_name: user.role.role_name,
                // role_id: user.role.id,
                fullname: user?.fullname,
              },
              process.env.MY_SECRET_ACCESS_KEY,
              {
                expiresIn: "24h",
              }
            );
            const { password, ...others } = user.dataValues;

            return {
              message: "Login success.",
              data: others,
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
    const decoded = jwt_decode(req.headers.authorization);
    let user;
    try {
        user = await UserProfile.findOne({
          where: {
            id: req.body.id ? req.body.id : decoded.id,
          },
          attributes: {
            exclude: ["referer_code"],
          },
          include: [
            {
              model: UserRole,
              as: "role",
            },
          ],
        });

        const {password, is_verified_account, ...others} = user.dataValues

        if(req.body.id) {
          if(decoded.role.id <= user.role.id){
            return others
          } else {
            throw new ClientError("You're not allowed to do this action", 404)
          }
        } else {
          return others
        }
    } catch (err) {
      throw err;
    }
  },

  getAllUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let where = {};
    if(decoded.role.id === 1) {
      where = {
        id: {
          [Op.ne]: decoded.role.id
        }
      }
    } else {
      where = {
        id: {
          [Op.gt]: decoded.role.id
        },
      }
    }
    let response = []
    try {
      const result = await UserProfile.findAll({
        include: [
          {
            model: db.userroles,
            as: "role",
            where: {...where}
          },
        ],
      })

      response = result.map((res) => {
        const {password, is_verified_account, role, ...others} = res.dataValues 
        return others
      })

      return response
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (req, res) => {
    let result;
    const decoded = jwt_decode(req.headers.authorization);
    try {
      const checkRole = await validateRole.update_delete(decoded, req.body.id, UserProfile);
      if(checkRole === 1){
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
              id: req.body.id,
            },
            transaction: t,
          });
        });
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action")
      } else if (checkRole === 2){
        throw new ClientError("Bad request")
      }
      return result;
    } catch (err) {
      throw err;
    }
  },

  deleteUser: async (req, res) => {
    try{
      let user = {}
      const decoded = jwt_decode(req.headers.authorization);
      const checkRole = await validateRole.update_delete(decoded, req.body.id, UserProfile);
      if(checkRole === 1) {
        user = await UserProfile.update({
          account_status: 'deleted'
        }, {
          where: {
            id: req.body.id
          }
        })
      } else if (checkRole === 2) {
        throw new ClientError("Bad request")
      } else if (checkRole === 0) {
        throw new ClientError("You  are not allowed to do this action.")
      }
      return user
    } catch(err){
      throw err
    }
  }
};

module.exports = userService;
