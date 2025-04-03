const express = require('express');             //import Express
const mongoose = require('mongoose');
const Campground = require('./models/campground') //importing the Campground model
const methodoverride = require('method-override') //importing method-override
const ejsMate = require('ejs-mate')               //importing ejs-mate

const catchAsync = require('./utils/catchAsync') //importing the catchAsync function
const ExpressError = require('./utils/ExpressError') //importing the ExpressError class

const Joi = require('joi'); // Import the Joi module
const {campgroundSchema , reviewSchema} = require('./schemas.js') // Import the campgroundSchema from the schemas.js file

const Review = require('./models/review') //importing the Review model

const campgrounds = require('./routes/campgrounds') //importing the campgrounds router
const reviews = require('./routes/reviews') //importing the reviews router


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Connection Open")
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();                          //create an instance of an Express application
const path = require('path');                   //Importing the path Module for ejs
const { title } = require('process');

const session = require('express-session') // Import the express-session module
const flash = require('connect-flash') // Import the connect-flash module

app.engine('ejs', ejsMate)                       //Tells Express to use ejs-mate instead of the default EJS engine.
app.set('view engine', 'ejs')                   //Setting the View Engine to EJS
app.set('views', path.join(__dirname, 'views'))   //This tells Express where to find the EJS templates.__dirname refers to the current directory of the script.all .ejs files should be placed inside a views folder

app.use(express.urlencoded({ extended: true }))  //This is a built-in middleware in Express. It parses incoming requests with urlencoded payloads and is based on body-parser. It is responsible for parsing the incoming request bodies in a middleware before you handle it.  It makes the data available in req.body.
app.use(methodoverride('_method'))               //This is a middleware function that allows us to use HTTP verbs such as PUT or DELETE in places where they are not supported. It is used to override the method in the request and change it to the specified method. It takes a single argument, which is the key in the request body that contains the method override value.


const sessionConfig = {                     //This is the configuration object for the session middleware.
    secret: 'thisshouldbeabettersecret', // This is the secret used to sign the session ID cookie. It should be a long, random string in production.
    resave: false, // This option determines whether to save the session to the store even if it was never modified during the request. Setting it to false means that the session will not be saved if it was never modified.
    saveUninitialized: true, // This option determines whether to save uninitialized sessions to the store. Setting it to true means that uninitialized sessions will be saved.    
    cookie: { // This is the configuration object for the session cookie.
        httpOnly: true, // This option prevents the cookie from being accessed by JavaScript in the browser. It helps to mitigate the risk of cross-site scripting (XSS) attacks.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // This sets the expiration time for the session cookie to one week from now.
        maxAge: 1000 * 60 * 60 * 24 * 7, // This sets the maximum age for the session cookie to one week.
        }

        
}



app.use(session(sessionConfig)) // This is a middleware function that initializes the session
app.use(flash()) // This is a middleware function that initializes the flash messages

app.use((req, res, next) => { // This is a middleware function that sets the flash messages in the response locals
    res.locals.success = req.flash('success') // This sets the success flash message in the response locals
    res.locals.error = req.flash('error') // This sets the error flash message in the response locals
    next() // Call the next middleware function in the stack
})


app.use('/campgrounds', campgrounds) // Use the campgrounds router for all routes that start with /campgrounds
app.use('/campgrounds/:id/reviews', reviews) // Use the reviews router for all routes that start with /campgrounds/:id/reviews


app.use(express.static(path.join(__dirname, 'public'))) //This tells Express to serve the files in the public directory as static assets. This allows us to include CSS and JavaScript files in our templates.


app.get('/', (req, res) => {
    res.render('home')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {

    const { statusCode = 500 } = err; // Destructure the status code and message from the error object 500 is the default status code
    if (!err.message) err.message = 'Something Went Wrong' // Set the default error message if it is not provided
    res.status(statusCode).render('error', { err }) // Render the error template with the status code and message

})

app.listen(3000, () => {                         //function starts the server on port 3000.
    console.log("Serving on port 3000")
});

