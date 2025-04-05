const { campgroundSchema ,reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError'); // Import the ExpressError class for error handling
const Campground = require('./models/campground'); // Import the Campground model to interact with the database
const Review = require('./models/review'); // Import the Review model to interact with the database


module.exports.isLoggedIn = (req, res, next) => {


    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!') // Set a flash message for user not authenticated
        return res.redirect('/login') // Redirect to the login page if the user is not authenticated
    }
    // Middleware function to check if the user is logged in
    // If the user is authenticated, proceed to the next middleware or route handler
    // Otherwise, redirect to the login page with a flash message
    next() // Call next() to proceed to the next middleware or route handler
}


module.exports.validateCampground = (req, res, next) => {

    const {error} = campgroundSchema.validate(req.body) // Validate the campground object against the schema

    if (error) {
        const msg = error.details.map(el => el.message).join(',') // Extract the error message from the error object //error.details is an array of objects that contain the error messages //map() is used to extract the error messages from the objects and join() is used to join the messages into a single string
        throw new ExpressError(msg,400)
    }
    else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params // Extract the ID from the request parameters
    const campground = await Campground.findById(id) // Find the campground with the provided ID and update it with the new information
    if (!campground) { // Check if the campground exists
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }

    if (!req.user || !campground.author.equals(req.user._id)) { // Check if the current user is the author
        req.flash('error', 'You do not have permission to do that!'); // Set a flash message for unauthorized access
        return res.redirect(`/campgrounds/${id}`); // Redirect to the show page for the campground
    }
    next() // Call next() to proceed to the next middleware or route handler
}


module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body) // Validate the review object against the schema

    if (error) {
        const msg = error.details.map(el => el.message).join(',') // Extract the error message from the error object
        throw new ExpressError(msg,400)
    }
    else {
        next()
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params // Extract the ID from the request parameters
    const review = await Review.findById(reviewId) // Find the review with the provided ID

    if (!review) { // Check if the review exists
        req.flash('error', 'Review not found!'); // Set a flash message for review not found
        return res.redirect(`/campgrounds/${id}`); // Redirect to the campground's show page
    }
    if (!req.user || !review.author.equals(req.user._id)) { // Check if the current user is the author
        req.flash('error', 'You do not have permission to do that!'); // Set a flash message for unauthorized access
        return res.redirect(`/campgrounds/${id}`); // Redirect to the show page for the campground
    }
    next() // Call next() to proceed to the next middleware or route handler
}