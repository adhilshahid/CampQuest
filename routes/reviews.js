const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js')





const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body) // Validate the review object against the schema

    if (error) {
        const msg = error.details.map(el => el.message).join(',') // Extract the error message from the error object
        throw new ExpressError(msg,400)
    }
    else {
        next()
    }
}


router.post('/',validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!') // Set a flash message for successful review creation
    res.redirect(`/campgrounds/${campground._id}`)
   
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // Find the campground with the provided ID and remove the review with the provided review ID from the reviews array
    await Review.findByIdAndDelete(reviewId) // Find the review with the provided ID and delete it
    req.flash('success', 'Successfully deleted review!') // Set a flash message for successful review deletion
    res.redirect(`/campgrounds/${id}`) // Redirect to the show page for the campground

}))


module.exports = router;