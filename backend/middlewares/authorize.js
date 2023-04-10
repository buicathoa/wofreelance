const jwt_decode = require("jwt-decode");
const { ClientError } = require("../errors");
const db = require("../models");
const { handleError } = require("../utils/handleResponse");
const UserProfile = db.userprofile;
const UserRole = db.userroles;

const authorize = (roles = []) => {
  return async (req, res, next) => {
      try {
        const token = req.headers.authorization;
        const decoded = jwt_decode(token);
        if(token) {
            const user = await UserProfile.findOne({
                where: {
                    id: decoded.id
                },
                include: [
                    {
                        model: UserRole,
                        attributes: ['role_name'],
                        as: 'role'
                    }
                ]
            })
            if(user){
                if(roles.includes(user.role.role_name)){
                    next()
                } else {
                    return res.status(403).json({message: 'You are not allowed to do this action.'})
                }
            } else {
                return res.status(401).json({message: 'You are not authenticated.'})
            }
        } else {
            return res.status(401).json({message: 'You are not authenticated.'})
        }
    } catch (err) {
        return res.status(401).json({message: 'You are not authenticated.'})
    }
  };
};

module.exports = authorize;
