const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const axios = require("axios");
const nodemailer = require("nodemailer");

const FacebookStrategy = require("passport-facebook").Strategy;
const { handleError } = require("../../utils/handleResponse");
const { Op } = require("sequelize");
const { ClientError } = require("../../errors");
const RestApiMethods = require("../../utils/QueryInsertPattern");
const { validateRole } = require("../../utils/validateRole");
const { emailTemplate } = require("../../utils/helper");
const UserProfile = db.userprofile;
const UserRole = db.userroles;
const Skillset = db.jobskillset;
const User_Skillset = db.user_skillset;
const Post = db.posts;
const Languages = db.languages;
const User_Languages = db.user_languages;
const io = require("./../../server");
const CONSTANT = require("../../constants");
// const returnDataSocket = require("../../wsHandler/returnDataSocket");
// const io = require("socket.io")
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
          is_verified_account: false,
          facebook: false,
          linkedin: false,
          role_id: role_id,
          account_status: "offline",
          account_type: "normal",
          username: username,
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
            model: Post,
          },
        ],
        group: ["id"],
      });

      if (user) {
        if (!bcrypt.compareSync(password, user.password) || !user.is_verified_account) {
          return 1;
        } else {
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
          ...req.body,
        },
        attributes: {
          exclude: ["referer_code"],
        },
        include: [
          {
            model: Skillset,
            as: "list_skills",
            attributes: [
              "id",
              "name",
              [
                sequelize.literal(
                  "(select count(wofreelance.post_skillsets.id) from wofreelance.post_skillsets where skillset_id = wofreelance.list_skills.id)"
                ),
                "job_matching_count",
              ],
            ],
            through: {},
          },
          {
            model: UserRole,
            as: "role",
          },
          {
            model: Post,
          },
          {
            model: Languages,
            as: "languages",
            through: {},
          },
        ],
      }).then((res1) => {
        if (res1 !== null) {
          const { password, ...others } = res1.dataValues;
          let list_skills = [];
          if (others?.list_skills.length > 0) {
            list_skills = others.list_skills.map((skill) => {
              return {
                job_matching_count: skill.dataValues.job_matching_count,
                id: skill.dataValues.id,
                name: skill.dataValues.name,
              };
            });
          }
          user = { ...others, list_skills: list_skills };
          if (req.body.id) {
            if (decoded.role.id <= user.role.id) {
              return user;
            } else {
              throw new ClientError(
                "You're not allowed to do this action",
                404
              );
            }
          } else {
            return user;
          }
        } else {
          return 1;
        }
      });
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
                user_id: checkRole === 1 ? decoded.id : req.body.id,
                skillset_id: skill.id,
              })
            );
          }
          await Promise.all(promises);
        } else if (req.body.languages) {
          const listLangs = req.body.languages.split(",");
          for (lang of listLangs) {
            await User_Languages.findOrCreate({
              where: {
                user_id: checkRole === 1 ? decoded.id : req.body.id,
                language_id: parseInt(lang),
              },
              defaults: {
                user_id: checkRole === 1 ? decoded.id : req.body.id,
                language_id: parseInt(lang),
              },
            });
          }
        }
        await UserProfile.update(
          { ...req.body, avatar: req?.file?.path },
          {
            where: {
              id: checkRole === 1 ? decoded.id : req.body.id,
            },
          }
        );
        result = await UserProfile.findOne({
          where: {
            id: checkRole === 1 ? decoded.id : req.body.id,
          },
        });
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

  loginFacebook: (user_id = null, res) => {
    try {
      passport.use(
        new FacebookStrategy(
          {
            clientID: 1282671125988781,
            clientSecret: "c7367d5dcbba2cf3c11c5520684a7c05",
            callbackURL:
              user_id !== null
                ? `http://localhost:1203/v1/user/auth/facebook/callback?user_id=${user_id}`
                : `http://localhost:1203/v1/user/auth/facebook/callback`,
            profileFields: ["id", "displayName", "name", "picture.type(large)", "email"],
          },
          async function (accessToken, refreshToken, profile, cb) {
            let user;
            if(!user_id) {
              const userInfo = {
                first_name: profile?.name?.familyName,
                last_name: profile?.name?.givenName,
                avatar: profile?.photos[0]?.value,
                facebook: true,
                account_type: 'facebook',
                role_id: 3,
                email: profile.emails[0].value
              }
              await res.cookie('user_info', JSON.stringify(userInfo), { maxAge: 900000});
              await res.cookie('login_type', 'facebook', { maxAge: 900000 })
            } else {
              user =  await UserProfile.update(
                {
                  first_name: profile?.name?.familyName,
                  last_name: profile?.name?.givenName,
                  avatar: profile?.photos[0]?.value,
                  facebook: true,
                },
                {
                  where: {
                    id: user_id,
                  },
                }
              );
            }
            return cb(user, null);
          }
        )
      );
      return passport;
    } catch (err) {
      throw err;
    }
  },

  createLanguage: async (req, res) => {
    let result = [];
    try {
      await axios
        .get(
          "https://www.freelancer.com/ajax-api/language/getLanguages.php?active_only=true&compact=true&new_errors=true&new_pools=true"
        )
        .then(function (response) {
          result = response?.data?.result?.languages?.map((language) => {
            return {
              code: language.code,
              english_name: language.english_name,
              iso_639_1: language.iso_639_1,
              iso_639_2: language.iso_639_2,
              language: language.language,
            };
          });
        });
      const response = await Languages.bulkCreate(result);
      return response;
    } catch (err) {
      throw err;
    }
  },

  getAllLanguage: async (req, res) => {
    try {
      const result = await Languages.findAll({});
      return result;
    } catch (err) {
      throw err;
    }
  },

  verificationEmail: async (req, res) => {
    try {
      const user = await UserProfile.findOne({
        where: {
          username: req.query.username,
        },
      });
      if (!user) {
        res.redirect(process.env.URL_FRONTEND);
      }
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      var mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: "buicathoa@gmail.com",
        subject: `Verify account email from  woffreelance`,
        html: emailTemplate(user.email, user.id),
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error Mail", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return true;
    } catch (err) {
      throw err;
    }
  },

  emailVerified: async (req, res) => {
    const { TOKEN, USER_INFO } = CONSTANT.WS_EVENT;
    let transaction = await sequelize.transaction();
    try {
      await UserProfile.update(
        {
          is_verified_account: true,
        },
        {
          where: {
            id: req.query.id,
          },
        }
      );

      const user = await UserProfile.findOne({
        where: {
          id: req.query.id,
        },
      });

      // const result = await verifiedEmailSuccess
      await transaction.commit();
      return user;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

module.exports = userService;
// module.exports = verifiedEmailSuccess
