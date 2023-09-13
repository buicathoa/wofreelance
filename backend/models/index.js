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
db.experiences = require("./Experience/experiences")(sequelize,DataTypes)
db.qualifications = require("./Qualifications/qualifications")(sequelize,DataTypes)
db.countries = require("./Country/country")(sequelize,DataTypes)
db.universities = require("./Universities/universities")(sequelize,DataTypes)
db.currencies = require("./Currency/currency")(sequelize,DataTypes)
db.budgets = require("./Budgets/budgets")(sequelize, DataTypes)
db.portfolio = require("./Portfolio/portfolio")(sequelize, DataTypes)
db.notifications = require("./Notifications/notifications")(sequelize, DataTypes)
db.sockets = require("./SocketModel/socketmodel")(sequelize, DataTypes)
db.rooms = require("./Chat/room")(sequelize, DataTypes)
db.messages = require("./Chat/messages")(sequelize, DataTypes)
//category: IT-Sofware, BA, Marketing...
db.jobcategories = require("./JobCategory/jobcategories")(sequelize, DataTypes)
db.bidding = require("./Bidding/bidding")(sequelize, DataTypes)


//skillset: javascript, react,...
db.jobskillset = require("./JobCategory/jobskillset")(sequelize, DataTypes)

//Junction table many to many (skillset - posts): skillset_id and post_id
db.post_skillsets = require("./Posts/post_skillsets")(sequelize, DataTypes)

// Junction table skill of user 
db.user_skillset = require("./userModel/user_skillset")(sequelize, DataTypes)

// Junction table language of user 
db.user_languages = require("./userModel/user_languages")(sequelize, DataTypes)

// Junction table exp of user 
db.user_experiences = require("./userModel/user_experiences")(sequelize, DataTypes)

// Junction table exp of user 
db.user_educations = require("./userModel/user_education")(sequelize, DataTypes)


// Junction table skillset and portfolio
db.portfolio_skillset = require("./Portfolio/portfolio_skillset")(sequelize, DataTypes)

// Junction table between notifications and user
db.user_notifications = require("./Notifications/user_notifications")(sequelize, DataTypes)


// Junction table between bidding and user
db.user_bidding = require("./userModel/user_bidding")(sequelize, DataTypes)

//reviews table
// db.reviews = require("./Reviews/review")(sequelize, DataTypes)

//Post table
db.posts = require("./Posts/post")(sequelize, DataTypes)

db.user_loggedin = require("./UserLoggedIn/userloggedin")(sequelize, DataTypes)

// Junction table between users and rooms
db.users_rooms = require("./Chat/users_rooms")(sequelize, DataTypes)
// =============================================================================== One to One Relationships =================================================================//

db.userroles.hasOne(db.userprofile, {
  foreignKey: 'role_id',
  as: 'role'
})
db.userprofile.belongsTo(db.userroles, {
  foreignKey: 'role_id',
  as: 'role'
})



db.countries.hasOne(db.userprofile, {
  foreignKey: 'country_id',
  as: 'user'
})
db.userprofile.belongsTo(db.countries, {
  foreignKey: 'country_id',
  as: 'country'
})



db.userprofile.hasOne(db.user_loggedin, {
  foreignKey: 'user_id',
  as: 'user_info'
})
db.user_loggedin.belongsTo(db.userprofile, {
  foreignKey: 'user_id',
  as: 'user_info'
})



db.userprofile.hasOne(db.sockets, {
  foreignKey: 'user_id',
  as: 'socket'
  // as: 'user'
})
db.sockets.belongsTo(db.userprofile, {
  foreignKey: 'user_id',
  // as: 'user'
})


db.rooms.hasOne(db.bidding, {
  foreignKey: 'room_id',
  as: 'room'
})
db.bidding.belongsTo(db.rooms, {
  foreignKey: 'room_id',
  as: 'room'
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
  foreignKey: 'user_id',
  as: 'post'
})
db.posts.belongsTo(db.userprofile, {
  foreignKey: 'user_id',
  as: 'user'
})


db.countries.hasMany(db.universities, {
  foreignKey: 'country_id',
  as: 'educations'
})
db.universities.belongsTo(db.countries, {
  foreignKey: 'country_id',
  as: 'country'
})



db.currencies.hasMany(db.budgets, {
  foreignKey: 'currency_id',
  as: 'budgets'
})
db.budgets.belongsTo(db.currencies, {
  foreignKey: 'currency_id',
  as: 'currency'
})



db.budgets.hasMany(db.posts, {
  foreignKey: 'project_budget',
  as: 'budget'
})
db.posts.belongsTo(db.budgets, {
  foreignKey: 'project_budget',
  as: 'budget'
})



db.posts.hasMany(db.bidding, {
  foreignKey: 'post_id',
  as: 'biddings'
})
db.bidding.belongsTo(db.posts, {
  foreignKey: 'post_id',
  as: 'biddings'
})


db.rooms.hasMany(db.messages, {
  foreignKey: 'room_id',
  as: 'messages'
})
db.messages.belongsTo(db.rooms, {
  foreignKey: 'room_id',
  as: 'room'
})


db.userprofile.hasMany(db.messages, {
  foreignKey: 'sender',
  as: 'sender_info'
})
db.messages.belongsTo(db.userprofile, {
  foreignKey: 'sender',
  as: 'sender_info'
})


db.userprofile.hasMany(db.messages, {
  foreignKey: 'receiver_id',
  as: 'receiver_info'
})
db.messages.belongsTo(db.userprofile, {
  foreignKey: 'receiver_id',
  as: 'receiver_info'
})

// ========================================================================================== End ==========================================================================================//




// =============================================================================== Many to Many Relationship =============================================================================== // 

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
  as: 'list_skills'
})
db.jobskillset.belongsToMany(db.userprofile, {
  through: db.user_skillset,
  foreignKey: 'skillset_id',
  as: 'user'
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




db.userprofile.belongsToMany(db.experiences, {
  through: db.user_experiences,
  foreignKey: 'user_id',
  otherKey: 'experience_id',
  as: 'list_experiences'
})
db.experiences.belongsToMany(db.userprofile, {
  through: db.user_experiences,
  foreignKey: 'experience_id',
  otherKey: 'user_id',
})




db.userprofile.belongsToMany(db.universities, {
  through: db.user_educations,
  foreignKey: 'user_id',
  as: 'educations'
})
db.universities.belongsToMany(db.userprofile, {
  through: db.user_educations,
  foreignKey: 'education_id',
  as: 'user'
})




db.portfolio.belongsToMany(db.jobskillset, {
  through: db.portfolio_skillset,
  foreignKey: 'portfolio_id',
  otherKey: 'skillset_id',
  as: 'skills'
})
db.jobskillset.belongsToMany(db.portfolio, {
  through: db.user_educations,
  foreignKey: 'skillset_id',
  otherKey: 'portfolio_id',
  as: 'portfolios'
})





db.notifications.belongsToMany(db.userprofile, {
  through: db.user_notifications,
  foreignKey: 'notification_id',
  otherKey: 'user_id',
  as: 'user'
})
db.userprofile.belongsToMany(db.notifications, {
  through: db.user_notifications,
  foreignKey: 'user_id',
  otherKey: 'notification_id',
  as: 'notifications'
})



db.userprofile.belongsToMany(db.bidding, {
  through: db.user_bidding,
  foreignKey: 'user_id',
  otherKey: 'bidding_id',
  as: 'bidding'
})
db.bidding.belongsToMany(db.userprofile, {
  through: db.user_bidding,
  foreignKey: 'bidding_id',
  otherKey: 'user_id',
  as: 'user'
})


db.userprofile.belongsToMany(db.rooms, {
  through: db.users_rooms,
  foreignKey: 'user_id',
  otherKey: 'room_id',
  as: 'rooms'
})
db.rooms.belongsToMany(db.userprofile, {
  through: db.users_rooms,
  foreignKey: 'room_id',
  otherKey: 'user_id',
  as: 'users'
})

// ========================================================================================== End ==========================================================================================//




//reviews
// db.userprofile.hasMany(db.reviews, {foreignKey: 'user_id'}),
// db.userprofile.hasMany(db.reviews, {foreignKey: 'user_was_reviewed_id'})





// db.serviceprofiles = require("./userModel/serviceprofile")(sequelize, DataTypes)

// db.serviceprofiles.belongsTo(db.generalprofiles, {foreignKey: 'user_id'})
// db.generalprofiles.hasOne(db.serviceprofiles, {foreignKey: 'user_id'})

module.exports = db;
