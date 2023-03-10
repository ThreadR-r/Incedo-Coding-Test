/**
 * @file Search middleware to validate the request requirements.
 * @author Elian (ThreadR) Freyermuth
 */

const fsPromises = require("fs").promises;
const config = require("../../../config/config");

/**
 * This function allows to check the requirements for the search endpoint.
 * It checks if artist_name and csv_output_filename are set and the CSV doesn't
 * exists if override is disabled
 * @async
 */
const SearchMiddleware = async (req, res, next) => {
    errors = [];

    // Cheking required parameters
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


    // Check if CSV output file exists and decide to throw error or not according to the config choice.
    // Checking the file existence is only made if the override is disabled to prevent useless I/O usage.
    if (!config.ARTISTS_SEARCH_OVERRIDE_FILE) {
        try {
            await fsPromises.access(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${req.body.csv_output_filename}`, fsPromises.constants.F_OK);
    
            // File already exists
            const err = new Error("Output file exists.");
            err.errors = [
                `The file ${req.body.csv_output_filename} exists.`
            ];

            return next(err);
        } catch(error) {
            //ignore errors.
        }
    }


    next();
};

module.exports = SearchMiddleware;