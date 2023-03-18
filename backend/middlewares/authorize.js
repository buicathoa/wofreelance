const jwt_decode = require("jwt-decode");
const { ClientError } = require("../errors");
const db = require("../models");
const UserProfile = db.userprofile;

const authorize = (roles = [], task) => {
  return (req, res, next) => {
    console.log("token ne", req.headers.token);
    const token = req.headers.authorization;
    const decoded = jwt_decode(token);
    if (token) {
      try {
        if (decoded.role === "super_admin") {
          next();
        } else if (task === "user") {
          if (req.body.id) {
            if (decoded.id === req.body.id) {
              next();
            } else {
              UserProfile.findOne({
                where: {
                  id: req.body.id ? req.body.id : req.body.user_id,
                },
              }).then((user) => {
                if (user && decoded.role === "admin" && user.role === "user") {
                  next();
                } else {
                  return res.status(403).json({
                    message:
                      "You do not have permission to perform this action",
                  });
                }
              });
            }
          } else {
            if(roles.includes(decoded.role)){
              next()
            } else {
              return res.status(403).json({
                message:
                  "You do not have permission to perform this action",
              });
            }
          }
        } else if(task === "others"){
          if(roles.includes(decoded.role)){
            next()
          } else {
            return res.status(403).json({
              message:
                "You do not have permission to perform this action",
            });
          }
        }

        // if (decoded.id === req.body.id) {
        //   next();
        // } else if (decoded.role === "super_admin") {
        //   next();
        // } else if (decoded.role === "admin" === req.body.role) {
        //   next();
        // } else {
        //   res.status(403).json({
        //     message: "You do not have permission to perform this action",
        //   });
        // }
      } catch (err) {
        throw err;
      }
    } else {
      throw new ClientError("You are not authenticated", 404);
    }
  };
};

module.exports = authorize;
