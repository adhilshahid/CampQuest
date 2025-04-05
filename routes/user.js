const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router instance
const User = require('../models/user'); // Import the User model
const catchAsync = require('../utils/catchAsync'); // Import the catchAsync utility function
const passport = require('passport');



router.get('/register', (req, res) => { // Route to render the registration form
    res.render('users/register'); // Render the register view
}); 


router.post('/register', catchAsync (async (req, res) => { // Route to handle user registration
    try{
    const { username, email, password } = req.body; // Destructure the request body to get the username, email, and password
    const user =  new User({email,username});
    const registeredUser = await User.register(user,password) // Register the user with the provided password//
    req.login(registeredUser, (err) => { // Log in the user after registration
        if (err) return next(err); // Handle any errors that occur during login
        req.flash('success', "Welcome to QuestCamp")
        res.redirect('/campgrounds'); // Redirect to the login page after registration
    }); // Call the register method on the User model to create a new user in the database
  
}catch (e) {
        req.flash('error', e.message); // Set a flash message for errors
        return res.redirect('/register'); // Redirect to the registration page if an error occurs
    }

}));

router.get('/login', (req, res) => { // Route to render the login form
    res.render('users/login'); // Render the login view
});

router.post('/login', passport.authenticate('local', { // Route to handle user login
    failureFlash: true, // Enable flash messages for login failures
    failureRedirect: '/login' // Redirect to the login page on failure
}), (req, res) => { // Callback function to handle successful login
    req.flash('success', 'Welcome back!'); // Set a flash message for successful login
    // const redirectUrl = req.session.returnTo || '/campgrounds'; // Get the redirect URL from the session or default to '/campgrounds'
    // delete req.session.returnTo; // Delete the returnTo property from the session
    res.redirect('/campgrounds'); // Redirect to the specified URL
});


router.get('/logout', (req, res) => { // Route to handle user logout
    req.logout(function(err) { // Call the logout function provided by Passport
        if (err) { return next(err); } // Handle any errors that occur during logout
        req.flash('success', 'Goodbye!'); // Set a flash message for successful logout
        res.redirect('/campgrounds'); // Redirect to the campgrounds page after logout
    });
});

module.exports = router; // Export the router instance

