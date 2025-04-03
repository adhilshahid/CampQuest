class ExpressError extends Error{
    constructor(message,statusCode){//
        super();
        this.message = message;
        this.statusCode = statusCode;//
    }
} // This class is used to create a custom error object that can be passed to the error handler middleware

module.exports = ExpressError; // Export the ExpressError class so that it can be used in other files