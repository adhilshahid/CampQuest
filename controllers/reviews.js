const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id // Set the author of the review to the current user
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!') // Set a flash message for successful review creation
    res.redirect(`/campgrounds/${campground._id}`)
   
}


module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // Find the campground with the provided ID and remove the review with the provided review ID from the reviews array
    await Review.findByIdAndDelete(reviewId) // Find the review with the provided ID and delete it
    req.flash('success', 'Successfully deleted review!') // Set a flash message for successful review deletion
    res.redirect(`/campgrounds/${id}`) // Redirect to the show page for the campground

}
