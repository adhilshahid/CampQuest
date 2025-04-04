const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import the Schema constructor from mongoose
const passportLocalMongoose = require('passport-local-mongoose'); // Import the passport-local-mongoose module


const UserSchema = new Schema({ // Create a new schema for the User model
    email: {
        type: String, // Define the email field as a string
        required: true, // Make the email field required
        unique: true // Ensure that the email field is unique
    },
});

UserSchema.plugin(passportLocalMongoose); // Add passport-local-mongoose plugin to the User schema

module.exports = mongoose.model('User', UserSchema); // Export the User model based on the User schema