const Campground = require('../models/campground');
const mongoose = require('mongoose');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}); // Find all campgrounds in the database
    res.render('campgrounds/index', { campgrounds }) // Render the campgrounds/index template and pass the campgrounds object to it
}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new') // Render the campgrounds/new template
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground) // Create a new campground  //req.body.campground is an object that contains the name and description of the campground 
    campground.author = req.user._id // Set the author of the campground to the current user
    await campground.save() // Save the campground to the database  
    req.flash('success', 'Successfully made a new campground!') // Set a flash message for successful campground creation
    res.redirect(`/campgrounds/${campground._id}`) // Redirect to the show page for the new campground

}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }
    try {
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author'); // Find the campground with the provided ID and populate the reviews field
        if (!campground) {
            req.flash('error', 'Campground not found!') // Set a flash message for campground not found
            return res.redirect('/campgrounds') // Redirect to the campgrounds index page
            // return res.status(404).send('Campground not found');
        }
        res.render('campgrounds/show', { campground });
    } catch (e) {
        res.status(500).send('Server error');
    }
}


module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id) // Find the campground with the provided ID 
    res.render('campgrounds/edit', { campground }) // Render the campgrounds/edit template and pass the campground object to it
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) // Find the campground with the provided ID and update it with the new information    
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`) // Redirect to the show page for the updated campground  
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id) // Find the campground with the provided ID and delete it
    req.flash('success', 'Successfully deleted campground!') // Set a flash message for successful campground deletion
    res.redirect('/campgrounds') // Redirect to the index page
}
