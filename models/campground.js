const mongoose = require('mongoose'); // Import Mongoose to interact with MongoDB
const { campgroundSchema } = require('../schemas');
const Review = require('./review') //importing the Review model
const Schema = mongoose.Schema; // Create a shortcut to mongoose.Schema

// Define the schema (structure) for a Campground
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


    CampgroundSchema.post('findOneAndDelete', async function (doc) { // Middleware that runs after a campground is deleted//findOneAndDelete is a Mongoose method that finds a single document and deletes it
        if (doc) {
            await Review.deleteMany({
                _id: {
                    $in: doc.reviews // Delete all reviews that have an ID that is in the reviews array of the campground //doc.reviews is an array of review IDs
                }
            })
        }
    })
    

// Export the Campground model for use in other parts of the application
module.exports = mongoose.model('Campground', CampgroundSchema);
