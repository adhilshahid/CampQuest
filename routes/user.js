const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router instance
const User = require('../models/user'); // Import the User model
const catchAsync = require('../utils/catchAsync'); // Import the catchAsync utility function
const passport = require('passport');

const users = require('../controllers/users'); // Import the users controller


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


router.get('/logout', users.logout)


   module.exports = router; // Export the router instance

