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
// let sequelizeCategories;
// let sequelizeJunctionTable;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize({...config});
  // sequelizeCategories = new Sequelize({...config, database: 'wofreelance_categories'});
  // sequelizeJunctionTable = new Sequelize({...config, database: 'wofreelance_junction_table'});
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
// db.sequelizeCategories = sequelizeCategories;
// db.sequelizeJunctionTable = sequelizeJunctionTable;
db.Sequelize = Sequelize;

//user profile
db.userprofile = require("./userModel/userprofile")(sequelize, DataTypes)
db.userroles = require("./userModel/userroles")(sequelize,DataTypes)
db.languages = require("./userModel/languages")(sequelize,DataTypes)

//category: IT-Sofware, BA, Marketing...
db.jobcategories = require("./JobCategory/jobcategories")(sequelize, DataTypes)


//skillset: javascript, react,...
db.jobskillset = require("./JobCategory/jobskillset")(sequelize, DataTypes)

//Junction table many to many (skillset - posts): skillset_id and post_id
db.post_skillsets = require("./Posts/post_skillsets")(sequelize, DataTypes)

// Junction table skill of user 
db.user_skillset = require("./userModel/user_skillset")(sequelize, DataTypes)

// Junction table language of user 
db.user_languages = require("./userModel/user_languages")(sequelize, DataTypes)

//reviews table
// db.reviews = require("./Reviews/review")(sequelize, DataTypes)

//Post table
db.posts = require("./Posts/post")(sequelize, DataTypes)


// =============================================================================== One to One Relationships =================================================================//

db.userroles.hasOne(db.userprofile, {
  foreignKey: 'role_id',
  as: 'role'
})
db.userprofile.belongsTo(db.userroles, {
  foreignKey: 'role_id',
  as: 'role'
})


// =============================================================================== One to Many Relationship =============================================================================== // 

//Making relations categories one to many=> IT-Sofware has many Website development, BA,... and BA or website development can be stored in one specific category
db.jobcategories.hasMany(db.jobskillset, {
  foreignKey: 'category_id',
  as: 'list_skills'
})
db.jobskillset.belongsTo(db.jobcategories, {
  foreignKey: 'category_id',
  as: 'list_skills'
})


db.userprofile.hasMany(db.posts, {
  foreignKey: 'user_id'
})
db.posts.belongsTo(db.userprofile, {
  foreignKey: 'user_id'
})





// ========================================================================================== End ==========================================================================================//




// =============================================================================== Many to Many Relationship =============================================================================== // 
db.userprofile.hasMany(db.posts, {
  foreignKey: 'id'
})

db.posts.belongsTo(db.userprofile, {
  foreignKey: 'user_id'
})




db.posts.belongsToMany(db.jobskillset, {
  through: db.post_skillsets,
  foreignKey: 'post_id',
  otherKey: 'skillset_id',
  as: 'list_skills'
})

db.jobskillset.belongsToMany(db.posts, {
  through: db.post_skillsets,
  foreignKey: 'skillset_id',
  otherKey: 'post_id',
})



db.userprofile.belongsToMany(db.jobskillset, {
  through: db.user_skillset,
  foreignKey: 'user_id',
  otherKey: 'skillset_id',
  as: 'list_skills'
})
db.jobskillset.belongsToMany(db.userprofile, {
  through: db.user_skillset,
  foreignKey: 'skillset_id',
  otherKey: 'user_id',
})



db.userprofile.belongsToMany(db.languages, {
  through: db.user_languages,
  foreignKey: 'user_id',
  otherKey: 'language_id',
  as: 'languages'
})
db.languages.belongsToMany(db.userprofile, {
  through: db.user_languages,
  foreignKey: 'language_id',
  otherKey: 'user_id',
})
// ========================================================================================== End ==========================================================================================//




//reviews
// db.userprofile.hasMany(db.reviews, {foreignKey: 'user_id'}),
// db.userprofile.hasMany(db.reviews, {foreignKey: 'user_was_reviewed_id'})





// db.serviceprofiles = require("./userModel/serviceprofile")(sequelize, DataTypes)

// db.serviceprofiles.belongsTo(db.generalprofiles, {foreignKey: 'user_id'})
// db.generalprofiles.hasOne(db.serviceprofiles, {foreignKey: 'user_id'})

module.exports = db;
