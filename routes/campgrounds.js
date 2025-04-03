const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const mongoose = require('mongoose');


const validateCampground = (req, res, next) => {

    const {error} = campgroundSchema.validate(req.body) // Validate the campground object against the schema

    if (error) {
        const msg = error.details.map(el => el.message).join(',') // Extract the error message from the error object //error.details is an array of objects that contain the error messages //map() is used to extract the error messages from the objects and join() is used to join the messages into a single string
        throw new ExpressError(msg,400)
    }
    else {
        next()
    }
}



router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({}); // Find all campgrounds in the database
    res.render('campgrounds/index', { campgrounds }) // Render the campgrounds/index template and pass the campgrounds object to it
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground) // Create a new campground  //req.body.campground is an object that contains the name and description of the campground 
    await campground.save() // Save the campground to the database  
    req.flash('success', 'Successfully made a new campground!') // Set a flash message for successful campground creation
    res.redirect(`/campgrounds/${campground._id}`) // Redirect to the show page for the new campground

}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }
    try {
        const campground = await Campground.findById(id).populate('reviews'); // Find the campground with the provided ID and populate the reviews field
        if (!campground) {
            req.flash('error', 'Campground not found!') // Set a flash message for campground not found
            return res.redirect('/campgrounds') // Redirect to the campgrounds index page
            // return res.status(404).send('Campground not found');
        }
        res.render('campgrounds/show', { campground });
    } catch (e) {
        res.status(500).send('Server error');
    }
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id) // Find the campground with the provided ID 
    res.render('campgrounds/edit', { campground }) // Render the campgrounds/edit template and pass the campground object to it
}))

router.put('/:id',validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) // Find the campground with the provided ID and update it with the new information    
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`) // Redirect to the show page for the updated campground  
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id) // Find the campground with the provided ID and delete it
    req.flash('success', 'Successfully deleted campground!') // Set a flash message for successful campground deletion
    res.redirect('/campgrounds') // Redirect to the index page
}))



module.exports = router; // Export the router for use in other parts of the application