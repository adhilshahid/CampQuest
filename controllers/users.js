const User = require('../models/user'); // Import the User model



module.exports.renderRegister = (req, res) => { // Render the registration form
    res.render('users/register'); // Render the register view
}


module.exports.register = async (req, res) => { // Route to handle user registration
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

}


module.exports.renderLogin = (req, res) => { // Render the login form
    res.render('users/login'); // Render the login view
}


module.exports.login = (req, res) => { // Callback function to handle successful login
    req.flash('success', 'Welcome back!'); // Set a flash message for successful login
    // const redirectUrl = req.session.returnTo || '/campgrounds'; // Get the redirect URL from the session or default to '/campgrounds'
    // delete req.session.returnTo; // Delete the returnTo property from the session
    res.redirect('/campgrounds'); // Redirect to the specified URL
}


module.exports.logout = (req, res) => { // Route to handle user logout
    req.logout(function(err) { // Call the logout function provided by Passport
        if (err) { return next(err); } // Handle any errors that occur during logout
        req.flash('success', 'Goodbye!'); // Set a flash message for successful logout
        res.redirect('/campgrounds'); // Redirect to the campgrounds page after logout
    });
}
