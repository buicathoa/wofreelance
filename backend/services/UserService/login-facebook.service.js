const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 1282671125988781,
    clientSecret: 'c7367d5dcbba2cf3c11c5520684a7c05',
    callbackURL: "http://localhost:1203/v1/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }))

  module.exports = passport;