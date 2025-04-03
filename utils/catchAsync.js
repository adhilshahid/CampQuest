module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
} // This function is used to catch any errors that occur in the async function and pass them to the error handler middleware