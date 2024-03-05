module.exports = (err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something Went Wrong";

    res.status(errorStatus).json({
        status: false,
        msg: errorMessage
    });
}