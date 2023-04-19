const router = require('express').Router()
const passport = require('./../../services/UserService/login-facebook.service');

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
  });

module.exports = router
