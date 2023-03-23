'use strict';

const fs = require('fs');
const path = require('path');
const {Sequelize, DataTypes} = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
let sequelizeCategories;
let sequelizeJunctionTable;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
  sequelizeCategories = new Sequelize({...config, database: 'wofreelance_categories'});
  sequelizeJunctionTable = new Sequelize({...config, database: 'wofreelance_junction_table'})
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.sequelizeCategories = sequelizeCategories;
db.sequelizeJunctionTable = sequelizeJunctionTable;
db.Sequelize = Sequelize;

//user profile
db.userprofile = require("./userModel/userprofile")(sequelize, DataTypes)

//category: IT-Sofware, BA, Marketing...
db.jobcategories = require("./JobCategory/jobcategories")(sequelizeCategories, DataTypes)

//subcategory: website development...
db.jobsubcategories = require("./JobCategory/jobsubcategories")(sequelizeCategories, DataTypes)

//skillset: javascript, react,...
db.jobskillset = require("./JobCategory/jobskillset")(sequelizeCategories, DataTypes)

//Junction table many to many (skillset - posts): skillset_id and post_id
db.skillsetandposts = require("./JobCategory/skillsetandposts")(sequelize, DataTypes)

//Junction table many to many (subcategory - skillset): subcategory_id, skillset_id
db.subcategoryandskillset = require("./JobCategory/subcategoryandskillset")(sequelizeJunctionTable, DataTypes)

//reviews table
// db.reviews = require("./Reviews/review")(sequelize, DataTypes)

//Post table
db.posts = require("./Posts/post")(sequelize, DataTypes)


// =============================================================================== One to Many Relationship =============================================================================== // 

//Making relations categories one to many=> IT-Sofware has many Website development, BA,... and BA or website development can be stored in one specific category
db.jobcategories.hasMany(db.jobsubcategories, {foreignKey: 'category_id'})
db.jobsubcategories.belongsTo(db.jobcategories, {foreignKey: 'category_id'})

//Making relations one to many, 1 user can have multiple posts
db.userprofile.hasMany(db.posts, {foreignKey: 'user_id'})
db.posts.belongsTo(db.userprofile, {foreignKey: 'user_id'})


// ========================================================================================== End ==========================================================================================//




// =============================================================================== Many to Many Relationship =============================================================================== // 

//Making relations many to many, 1 posts can have multiple skillset, such as: 1 post Frontend jobs can have various skills(Javascript, React) and 1 skillset can be stored in various posts
db.posts.associate = (models) => {
  db.posts.belongsToMany(models.jobskillset, {through: db.skillsetandposts})
}
db.jobskillset.associate = (models) => {
  db.jobskillset.belongsToMany(models.posts, {through: db.skillsetandposts})
}


//Making relations many to many => 1 website development can have multiple skillset and 1 skillset can be stored in frontend and backend,...
// db.jobsubcategories.belongsToMany(db.jobskillset, {through: db.subcategoryandskillset})
// db.jobskillset.belongsToMany(db.jobsubcategories, {through: db.subcategoryandskillset})
db.jobsubcategories.associate = (models) => {
  db.jobsubcategories.belongsToMany(models.jobskillset, {through: db.subcategoryandskillset})
}
db.jobskillset.associate = (models) => {
  db.jobskillset.belongsToMany(models.jobsubcategories, {through: db.subcategoryandskillset})
}
// ========================================================================================== End ==========================================================================================//




//reviews
// db.userprofile.hasMany(db.reviews, {foreignKey: 'user_id'}),
// db.userprofile.hasMany(db.reviews, {foreignKey: 'user_was_reviewed_id'})





// db.serviceprofiles = require("./userModel/serviceprofile")(sequelize, DataTypes)

// db.serviceprofiles.belongsTo(db.generalprofiles, {foreignKey: 'user_id'})
// db.generalprofiles.hasOne(db.serviceprofiles, {foreignKey: 'user_id'})

module.exports = db;
