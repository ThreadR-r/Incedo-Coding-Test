module.exports = (req, res, next) => {
    errors = [];

    if (!req.body.artist_name) {
        errors.push("missing artist_name parameter");
    }
    if (!req.body.csv_output_filename) {
        errors.push("missing csv_output_filename parameter");
    }

    if (errors.length !== 0) {
        const err = new Error("Bad request: missing parameters");
        err.errors = errors;
        throw err;
    }
    next();
};