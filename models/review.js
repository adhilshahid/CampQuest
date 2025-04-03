const mongoose = require('mongoose'); // Import Mongoose to interact with MongoDB
const Schema = mongoose.Schema; // Create a shortcut to mongoose.Schema


const reviewSchema = new Schema({
    body: String,
    rating: Number
});


module.exports = mongoose.model('Review', reviewSchema); // Export the Review model for use in other parts of the application //The first argument is the singular name of the collection that the model is for. Mongoose automatically looks for the plural, lowercased version of the model name. Thus, for the example above, the model Review is for the reviews collection in the database. The second argument is the schema that defines the structure of the documents that will be stored in the collection.
