const jwt_decode = require("jwt-decode");
const { ClientError } = require("../errors");

const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt_decode(token);

    if (token) {
      try {
        if(decoded.role === 'super_admin'){
          next()
        } else if(decoded.role === 'admin' &&  req.body.role === 'user'){
          next()
        } else if(decoded.id === req.body.id){
          next()
        } else {
          res.status(403).json({message: "You do not have permission to perform this action"})
        }
        // if (
        //   decoded.id === req.body.user_id ||
        //   decoded.role === "super_admin"
        // ) {
        //   next();
        // } else {
        //   throw new ClientError("You're not allowed to do this action.", 401);
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
