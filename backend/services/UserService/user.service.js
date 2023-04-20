const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { handleError } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");
const RestApiMethods = require("../../utils/QueryInsertPattern");
const { validateRole } = require("../../utils/validateRole");
const UserProfile = db.userprofile;
const UserRole = db.userroles;
const Skillset = db.jobskillset;
const User_Skillset = db.user_skillset;
const Post = db.posts
// const ServiceProfiles = db.serviceprofiles
const sequelize = db.sequelize;
const userService = {
  registerAccount: async (req, res) => {
    const { email, password, role_id, is_verified_account, username } = req;
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
          is_verified_account: is_verified_account,
          facebook: false,
          linkedin: false,
          role_id: role_id,
          account_status: "offline",
          account_type: 'normal',
          username: username
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
            model: Skillset,
            as: "list_skills",
          },
          {
            model: UserRole,
            as: "role",
          },
          {
            model: Post
          }
        ],
        group: ["id"],
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
      await UserProfile.findOne({
        where: {
          id: req.body.id ? req.body.id : decoded.id,
        },
        attributes: {
          exclude: ["referer_code"],
        },
        include: [
          {
            model: Skillset,
            as: "list_skills",
            attributes: [
              'id',
              'name',
              [sequelize.literal('(select count(wofreelance.post_skillsets.id) from wofreelance.post_skillsets where skillset_id = wofreelance.list_skills.id)'), 'job_matching_count']
            ],
            through: {}
          },
          {
            model: UserRole,
            as: "role",
          },
          {
            model: Post
          }
        ],
      }).then(res => {
        const {password, is_verified_account, ...others} = res.dataValues;
        let list_skills = []
        if(others?.list_skills.length > 0) {
          list_skills = others.list_skills.map((skill) => {
            return {job_matching_count: skill.dataValues.job_matching_count, id: skill.dataValues.id, name: skill.dataValues.name}
          })
        }
        user = {...others, list_skills: list_skills}
      });

      if (req.body.id) {
        if (decoded.role.id <= user.role.id) {
          return user;
        } else {
          throw new ClientError("You're not allowed to do this action", 404);
        }
      } else {
        return user;
      }
    } catch (err) {
      throw err;
    }
  },

  getAllUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let where = {};
    if (decoded.role.id === 1) {
      where = {
        id: {
          [Op.ne]: decoded.role.id,
        },
      };
    } else {
      where = {
        id: {
          [Op.gt]: decoded.role.id,
        },
      };
    }
    let response = [];
    try {
      const result = await UserProfile.findAll({
        include: [
          {
            model: db.userroles,
            as: "role",
            where: { ...where },
          },
        ],
      });

      response = result.map((res) => {
        const { password, is_verified_account, role, ...others } =
          res.dataValues;
        return others;
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (req, res) => {
    let result;
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    try {
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.id,
        UserProfile
      );
      if (checkRole === 1 || checkRole === 3) {
        if (req.body.list_skills) {
          let promises = [];
          for (skill of req.body.list_skills) {
            promises.push(
              await User_Skillset.create({
                user_id: decoded.id,
                skillset_id: skill.id,
              })
            );
          }
          await Promise.all(promises);
          await UserProfile.update(
            { ...req.body, avatar: req?.file?.path },
            {
              where: {
                id: checkRole === 1 ? decoded.id : req.body.id,
              },
            }
          );
        } else {
          await UserProfile.update(
            { ...req.body, avatar: req?.file?.path },
            {
              where: {
                id: checkRole === 1 ? decoded.id : req.body.id,
              },
              returning: true,
            }
          );
        }
        result = await UserProfile.findOne({
          where: {
            id: checkRole === 1 ? decoded.id : req.body.id
          }
        })
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action");
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      }
      await transaction.commit();
      const { password, ...others } = result.dataValues;
      return others;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  deleteUser: async (req, res) => {
    try {
      let user = {};
      const decoded = jwt_decode(req.headers.authorization);
      const checkRole = await validateRole.update_delete(
        decoded,
        req.body.id,
        UserProfile
      );
      if (checkRole === 1) {
        user = await UserProfile.update(
          {
            account_status: "deleted",
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      } else if (checkRole === 0) {
        throw new ClientError("You  are not allowed to do this action.");
      }
      return user;
    } catch (err) {
      throw err;
    }
  },

  checkUser: async (req, res) => {
    let check = false;
    try {
      if (req.body.email) {
        const user = await UserProfile.findOne({
          where: {
            email: req.body.email,
          },
        });
        if (!user) {
          check = true;
        } else {
          check = false;
        }
      } else if (req.body.username) {
        const user = await UserProfile.findOne({
          where: {
            username: req.body.username,
          },
        });
        if (!user) {
          check = true;
        } else {
          check = false;
        }
      }
      return check;
    } catch (err) {
      throw err;
    }
  },

  loginFacebook: (user_id) => {
    try {
      passport.use(
        new FacebookStrategy(
          {
            clientID: 1282671125988781,
            clientSecret: "c7367d5dcbba2cf3c11c5520684a7c05",
            callbackURL: `http://localhost:1203/v1/user/auth/facebook/callback?user_id=${user_id}`,
            profileFields: ['id','displayName','name', 'picture.type(large)']
          },
          async function (accessToken, refreshToken, profile, cb) {
            console.log(user_id)
            const user = await UserProfile.update({
              first_name: profile?.name?.familyName,
              last_name: profile?.name?.givenName,
              avatar: profile?.photos[0]?.value,
              facebook: true
            }, {
              where: {
                id: user_id
              }
            })
            return cb(user, null);
          }
        )
      );
      return passport;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userService;
