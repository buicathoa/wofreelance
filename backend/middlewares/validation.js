// const { handleError } = require("../services/utils.service");

const options = {
  stripUnknow: true
}

const validationMiddleware = (schema, property, onlyFields = []) => {
  return (req, res, next) => {
    const {error} = schema.validate(req.body, options);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      console.log('validationMiddleware', error)
      const {details} = error;
      const message = details.map(i => i.message).join(',');
      res.status(400).json(400, message)
    }
  }
}
module.exports = validationMiddleware;