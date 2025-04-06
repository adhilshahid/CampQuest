const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')



const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js')

const reviews = require('../controllers/reviews'); // Import the reviews controller




router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview)) // Route to create a new review for a specific campground

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview)) // Route to delete a specific review by ID and redirect to the show page for the campground


module.exports = router;