
const jwt_decode = require("jwt-decode");
const jwt = require('jsonwebtoken');
const { handleError } = require("../utils/handleResponse");
const checkSecretKey = (roles = [], task) => {
    return (req, res, next) => {
      const token = req.headers.authorization;
      
      try{
        const decoded = jwt_decode(token, process.env.MY_SECRET_ACCESS_KEY);
        console.log(decoded)
      }catch(err){
        return handleError(res, err)
      }
    };
  };
  
  module.exports = checkSecretKey;