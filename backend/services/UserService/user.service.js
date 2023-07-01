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
const {
  emailTemplate,
  uploadImage,
  cloudinary,
  returnApiGetTimeAndLocation,
} = require("../../utils/helper");
const UserProfile = db.userprofile;
const UserRole = db.userroles;
const Skillset = db.jobskillset;
const User_Skillset = db.user_skillset;
const Post = db.posts;
const Languages = db.languages;
const User_Languages = db.user_languages;
const Experience = db.experiences;
const Countries = db.countries;
const UserLoggedIn = db.user_loggedin;
const Notifications = db.notifications;
const CONSTANT = require("../../constants");
const store = require("store");
const dayjs = require("dayjs");
const { io } = require("../../server");
const { removeUserOnline } = require("../../globalVariable");
const {myEmitter} = require("../../myEmitter");
// const returnDataSocket = require("../../wsHandler/returnDataSocket");
// const io = require("socket.io")
// const ServiceProfiles = db.serviceprofiles
const sequelize = db.sequelize;
const userService = {
  registerAccount: async (req, res) => {
    const {
      email,
      password,
      role_id,
      is_verified_account,
      username,
      account_type,
    } = req;
    try {
      const salt = await bcrypt.genSalt(10);
      let hashed = "";
      if (account_type === "normal") {
        hashed = await bcrypt.hash(password, salt);
      }
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
          ...req,
          email: email,
          password: account_type === "normal" ? hashed : null,
          is_verified_account: false,
          role_id: role_id,
          account_status: "offline",
          account_type: account_type,
          username: username,
        });
        return newUser;
      }
    } catch (err) {
      throw err;
    }
  },

  loginUser: async (req, res, socket, io) => {
    const { email, password, account_type } = req.body;
    const { USER_SIGNIN, USER_SIGNOUT } = CONSTANT.WS_EVENT;
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
          //   {
          //     model: Skillset,
          //     as: "list_skills",
          //   },
          {
            model: UserRole,
            as: "role",
          },
          //   {
          //     model: Post,
          //   },
          //   {
          //     model: Languages,
          //     as: "languages",
          //     through: {},
          //   },
          //   {
          //     model: Experience,
          //     as: "list_experiences",
          //     through: {},
          //   },
        ],
        group: ["id"],
      });

      if (user) {
        const accesstoken = jwt.sign(
          {
            id: user.id,
            role: user?.role,
            email: user?.email,
            role_name: user.role.role_name,
            role_id: user.role.id,
            fullname: user?.fullname,
          },
          process.env.MY_SECRET_ACCESS_KEY,
          {
            expiresIn: "24h",
          }
        );
        if (account_type === "facebook") {
          await UserProfile.update(
            {
              token: accesstoken,
            },
            {
              where: {
                id: user.id,
              },
            }
          );
          // await myEmitter.emit(USER_SIGNIN, user.id)
          return {
            message: "Login success.",
            data: user,
            token: accesstoken,
          };
        } else {
          const { status } = req.body;
          if (
            !bcrypt.compareSync(password, user.password) ||
            (!user.is_verified_account && status !== "sign_up")
          ) {
            return 1;
          } else {
            const accesstoken = jwt.sign(
              {
                id: user.id,
                role: user?.role,
                email: user?.email,
                role_name: user.role.role_name,
                role_id: user.role.id,
                fullname: user?.fullname,
              },
              process.env.MY_SECRET_ACCESS_KEY,
              {
                expiresIn: "24h",
              }
            );
            await UserProfile.update(
              {
                token: accesstoken,
              },
              {
                where: {
                  id: user.id,
                },
              }
            );
            const {
              password,
              ip_address,
              role_id,
              is_verified_account,
              token,
              ...others
            } = user.dataValues;
            myEmitter.emit(USER_SIGNIN, {user_id:  user.id, socket_id: socket.id})
            return {
              message: "Login success.",
              data: others,
              token: accesstoken,
            };
          }
        }
      } else {
        return 1;
      }
    } catch (err) {
      throw err;
    }
  },

  logoutUser: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    const { USER_SIGNIN, USER_SIGNOUT } = CONSTANT.WS_EVENT;
    let transaction = await sequelize.transaction();
    try {
      await UserProfile.update(
        {
          token: null,
        },
        {
          where: {
            id: decoded.id,
          },
        }
      );
      myEmitter.emit(USER_SIGNOUT, decoded.id)
      transaction.commit();
      return true;
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  },

  getUserInfo: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let user;
    try {
      const searchField = ["username", "email"];
      let searchCond = {};
      if (Object.keys(req.body).length > 0) {
        for (let i of Object.keys(req.body)) {
          if (req.body[i] !== null && searchField.includes(i)) {
            searchCond = Object.assign({ [i]: req.body[i] });
          }
        }
      }

      const userFound = await UserProfile.findOne({
        where: {
          id: req.body.user_id ?? decoded.id,
          ...searchCond,
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
            model: Countries,
            as: "country",
            attributes: ["id", "country_name", "country_official_name"],
          },
          {
            model: UserRole,
            as: "role",
          },
          {
            model: Languages,
            as: "languages",
            through: {},
          },
          {
            model: Notifications,
            as: "notifications",
            through: {
              attributes: []
            },
          },
        ],
      });
      if (userFound !== null) {
        const {
          password,
          ip_address,
          role_id,
          is_verified_account,
          token,
          ...others
        } = userFound.dataValues;
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
        let timeResponse = null;
        if (userFound.ip_address) {
          const decoded = jwt_decode(userFound.ip_address);
          const user_info = await axios.get(
            `https://api.ipdata.co/${decoded.ip_address}?api-key=${process.env.API_IPDATA_ACCESS_KEY}`
          );
          const timeConvert =
            new Date(user_info.data.time_zone.current_time).getTime() -
            new Date().getTimezoneOffset() * 60 * 1000;
          timeResponse = new Date(timeConvert).toLocaleString("en-US");
        }

        if (req.body.id) {
          if (decoded.role.id <= user.role.id) {
            return timeResponse
              ? { ...user, current_time: timeResponse }
              : { ...user };
          } else {
            throw new ClientError("You're not allowed to do this action", 404);
          }
        } else {
          return timeResponse
            ? { ...others, current_time: timeResponse }
            : { ...others };
        }
      } else {
        return 1;
      }
    } catch (err) {
      throw err;
    }
  },

  getUserInfoDestination: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let user;
    try {
      const searchField = ["username", "email"];
      let searchCond = {};
      if (Object.keys(req.body).length > 0) {
        for (let i of Object.keys(req.body)) {
          if (req.body[i] !== null && searchField.includes(i)) {
            searchCond = Object.assign({ [i]: req.body[i] });
          }
        }
      }

      const userFound = await UserProfile.findOne({
        where: {
          ...searchCond,
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
            model: Countries,
            as: "country",
            attributes: ["id", "country_name", "country_official_name"],
          },
          {
            model: UserRole,
            as: "role",
          },
          // {
          //   model: Post,
          // },
          {
            model: Languages,
            as: "languages",
            through: {},
          },
          // {
          //   model: Experience,
          //   as: "list_experiences",
          //   through: {},
          // },
        ],
      });
      if (userFound !== null) {
        const {
          password,
          ip_address,
          role_id,
          is_verified_account,
          token,
          ...others
        } = userFound.dataValues;
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
        let timeResponse = null;
        if (userFound.ip_address) {
          const decoded = jwt_decode(userFound.ip_address);
          const user_info = await axios.get(
            `https://api.ipdata.co/${decoded.ip_address}?api-key=${process.env.API_IPDATA_ACCESS_KEY}`
          );
          const timeConvert =
            new Date(user_info.data.time_zone.current_time).getTime() -
            new Date().getTimezoneOffset() * 60 * 1000;
          timeResponse = new Date(timeConvert).toLocaleString("en-US");
        }

        if (req.body.id) {
          if (decoded.role.id <= user.role.id) {
            return timeResponse
              ? { ...user, current_time: timeResponse }
              : { ...user };
          } else {
            throw new ClientError("You're not allowed to do this action", 404);
          }
        } else {
          return timeResponse
            ? { ...others, current_time: timeResponse }
            : { ...others };
        }
      } else {
        return 1;
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
        const { password, is_verified_account, role, token, ...others } =
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
          await User_Skillset.destroy({
            where: {
              user_id: checkRole === 1 ? decoded.id : req.body.id,
            },
          });
          for (skill of req.body.list_skills) {
            await User_Skillset.create({
              user_id: checkRole === 1 ? decoded.id : req.body.id,
              skillset_id: parseInt(skill.id),
            });
          }
        } else if (req.body.languages) {
          const listLangs = req.body.languages.split(",");
          await User_Languages.destroy({
            where: {
              user_id: checkRole === 1 ? decoded.id : req.body.id,
            },
          });
          for (lang of listLangs) {
            await User_Languages.create({
              user_id: checkRole === 1 ? decoded.id : req.body.id,
              language_id: parseInt(lang),
            });
          }
        }
        const { list_skills, languages, ...objUpdate } = req.body;

        await UserProfile.update(
          { ...objUpdate },
          {
            where: {
              id: checkRole === 1 ? decoded.id : req.body.id,
            },
          }
        );
        result = await userService.getUserInfo(req, res, "update");
      } else if (checkRole === 0) {
        throw new ClientError("You're not allowed to do this action");
      } else if (checkRole === 2) {
        throw new ClientError("Bad request");
      }
      await transaction.commit();
      const { password, ...others } = result;
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

  loginFacebook: (user_id = null, res, req) => {
    const urlSplit = req.url.split("=")[1];
    const moveNextRoute =
      urlSplit && urlSplit?.includes("%252") ? `?next=${urlSplit}` : "";
    try {
      passport.use(
        new FacebookStrategy(
          {
            clientID: 1282671125988781,
            clientSecret: "c7367d5dcbba2cf3c11c5520684a7c05",
            callbackURL:
              user_id !== null
                ? `http://localhost:1203/v1/user/auth/facebook/callback?user_id=${user_id}`
                : `http://localhost:1203/v1/user/auth/facebook/callback${moveNextRoute}`,
            profileFields: [
              "id",
              "displayName",
              "name",
              "picture.type(large)",
              "email",
              "location",
            ],
          },
          async function (accessToken, refreshToken, profile, cb) {
            if (!user_id) {
              const userFound = await UserProfile.findOne({
                where: {
                  email: profile.emails[0].value,
                },
                include: [
                  {
                    model: UserRole,
                    as: "role",
                  },
                ],
              });
              if (userFound) {
                const accesstoken = jwt.sign(
                  {
                    id: userFound.id,
                    role: userFound?.role,
                    email: userFound?.email,
                    role_name: userFound?.role.role_name,
                    role_id: userFound?.role.id,
                    fullname: userFound?.fullname,
                  },
                  process.env.MY_SECRET_ACCESS_KEY,
                  {
                    expiresIn: "24h",
                  }
                );

                // myEmitter.emit(USER_SIGNIN, userFound.id)
                await res.cookie("access_token", accesstoken, {
                  maxAge: 900000,
                });
                await UserProfile.update(
                  {
                    token: accesstoken,
                  },
                  {
                    where: {
                      id: userFound.id,
                    },
                  }
                );
                return cb(userFound, true);
              } else {
                const imageUrl = await cloudinary.uploader.upload(
                  profile?.photos[0]?.value,
                  { folder: "avatar" }
                );
                const userInfo = {
                  first_name: profile?.name?.familyName,
                  last_name: profile?.name?.givenName,
                  avatar: imageUrl.secure_url,
                  avatar_cropped: imageUrl.secure_url,
                  facebook: true,
                  account_type: "facebook",
                  role_id: 3,
                  email: profile.emails[0].value,
                  isNewRecord: true,
                };
                await res.cookie("user_info", JSON.stringify(userInfo), {
                  maxAge: 900000,
                });
                return cb(userInfo, false);
              }
            } else {
              const imageUrl = await cloudinary.uploader.upload(
                profile?.photos[0]?.value,
                { folder: "avatar" }
              );
              const user = await UserProfile.update(
                {
                  first_name: profile?.name?.familyName,
                  last_name: profile?.name?.givenName,
                  avatar: imageUrl?.secure_url,
                  avatar_cropped: imageUrl?.secure_url,
                  facebook: true,
                },
                {
                  where: {
                    id: user_id,
                  },
                }
              );
              return cb(user, false);
            }
          }
        )
      );
      return passport;
    } catch (err) {
      throw err;
    }
  },

  loginFacebookToken: async (req, res) => {
    const { email, account_type } = req.body;
    try {
      const user = await UserProfile.findOne({
        where: {
          email: email,
          account_type: account_type,
        },
      });
      if (user) {
        const accesstoken = jwt.sign(
          {
            id: user.id,
            role: user?.role,
            email: user?.email,
            role_name: user.role.role_name,
            role_id: user.role.id,
            fullname: user?.fullname,
          },
          process.env.MY_SECRET_ACCESS_KEY,
          {
            expiresIn: "24h",
          }
        );
        return {
          message: "Login success.",
          data: others,
          token: accesstoken,
        };
      }
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

  getAllSkillset: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    try {
      const result = await UserProfile.findOne({
        attributes: [],
        where: {
          id: req.body.user_id ?? decoded.id,
        },
        include: [
          {
            model: Skillset,
            as: "list_skills",
          },
        ],
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  createDelSkillset: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    let transaction = await sequelize.transaction();
    let result;
    try {
      await User_Skillset.destroy({
        where: {
          user_id: req.body.user_id ?? decoded.id,
        },
      });

      const listPayload = [];
      for (let i of req.body.list_skills) {
        listPayload.push({
          skillset_id: i.id,
          user_id: req.body.user_id ?? decoded.id,
        });
      }
      await User_Skillset.bulkCreate(listPayload);
      result = await UserProfile.findOne({
        attributes: [],
        where: {
          id: req.body.user_id ?? decoded.id,
        },
        include: [
          {
            model: Skillset,
            as: "list_skills",
          },
        ],
      });
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
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

  generatedAddress: async (req, res) => {
    const decoded = jwt_decode(req.headers.authorization);
    try {
      const ipAddress = await axios.get("https://api.ipify.org?format=json");
      const salt = await bcrypt.genSalt(10);
      let result = {};
      if (ipAddress.data.ip) {
        const user_info = await axios.get(
          returnApiGetTimeAndLocation(ipAddress.data.ip)
        );
        const country = await Countries.findOne({
          where: {
            country_name: user_info.data.country_code,
          },
        });

        const ip = jwt.sign(
          {
            ip_address: ipAddress.data.ip,
          },
          process.env.MY_SECRET_ACCESS_KEY,
          {
            expiresIn: "1000000 years",
          }
        );
        await UserProfile.update(
          {
            ip_address: ip,
          },
          {
            where: {
              id: decoded.id,
            },
          }
        );
        // const timeConvert =
        //   new Date(user_info.data.time_zone.current_time).getTime() -
        //   new Date().getTimezoneOffset() * 60 * 1000;
        // const timeResponse = new Date(timeConvert).toLocaleString("en-US");
        result = {
          province: user_info.data.city,
          zip_code: user_info.data.postal,
          country_id: parseInt(country.id) ?? null,
          // current_time: timeResponse,
        };
      }
      return result;
    } catch (err) {
      throw err;
    }
  },

  getUserLoggedIn: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.authorization);
      const result = await UserProfile.findAll({
        attributes: ["id", "email"],
        // where: {
        //   id: {
        //     [Op.ne]: 46,
        //   },
        // },
        include: [
          {
            model: UserLoggedIn,
            as: "user_info",
            where: {
              status: "online",
            },
            attributes: ["socket_id"],
          },
          {
            model: Notifications,
            as: "notifications",
            through: {
              attributes: [],
            },
            where: {
              noti_status: "not_received",
            },
          },
          // {
          //   attributes: ["id", "name"],
          //   model: Skillset,
          //   as: "list_skills",
          //   through: {
          //     attributes: [],
          //   },
          // },
        ],
      });
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userService;
// module.exports = verifiedEmailSuccess
