const Joi = require('joi'); // Import the Joi module

module.exports.campgroundSchema = Joi.object({  // Define a schema for the campground object
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({ // Define a schema for the review object
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})