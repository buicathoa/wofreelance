const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const { handleError } = require("../../utils/handleResponse");
const { Op, col, Sequelize } = require("sequelize");
const { ClientError } = require("../../errors");

const RestApiMethods = require("../../utils/QueryInsertPattern");
const { validateRole } = require("../../utils/validateRole");
const QueryParameter = require("../../utils/QueryParameter");
const userService = require("../UserService/user.service");
const Experience = db.experiences;
const User_Experiences = db.user_experiences;
const Posts_skillsets = db.post_skillsets;
const UserProfiles = db.userprofile;
const Countries = db.countries;
const axios = require("axios");

const sequelize = db.sequelize;
// const sequelizeCategories = db.sequelizeCategories;
// const sequelizeJunctionTable = db.sequelizeJunctionTable;

const countryService = {
  createCountry: async (req, res) => {
    let response_countries;
    try {
      await axios
        .get("https://countriesnow.space/api/v0.1/countries/positions")
        .then(async function (response) {
          let result = []
          for (const prop of response.data.data) {
            result.push({
              country_name: prop.iso2,
              country_official_name: prop.name
            })
          }
          // result = response?.data?.map((country) => {
          //   return {
          //     country_name: country.name.common,
          //     country_official_name: country.name.official,
          //     flags: country.flags.png,
          //   };
          // });
          response_countries = await Countries.bulkCreate(result)
        });
      return response_countries
    } catch (err) {
      throw err;
    }
  },

  getCountries: async (req, res) => {
    try {
      const countries = req.body.id ?  await Countries.findOne({
        where: req.body.id 
      }) :  await Countries.findAll({
        where: {}
      })

      return countries
    } catch(err){
      throw err
    }
  }
};

module.exports = countryService;
