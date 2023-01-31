const request = require("supertest");
const assert = require("assert");
const fsPromises = require("fs").promises;

/* -------------------------------------------------------------------------- */
/*                                    Init                                    */
/* -------------------------------------------------------------------------- */

// Load environments variables according to the running mode. (prod, dev or staging)
(function load_env() {
    require("dotenv").config({
        path: `.env.${process.env.NODE_ENV}`
    });

    if (!process.env.LASTFM_API_KEY) {
        throw new Error("Critical LastFM API Key not given. Exiting...");
    }
})();

const app = require("../app");

const config = require("../config/config");

/* -------------------------------------------------------------------------- */
/*                                 Tests beging                                */
/* -------------------------------------------------------------------------- */

describe("GET api entry point /", function() {
    it("Test home entry point", async function() {
        const response = await request(app)
            .get('/');

        assert.equal(response.body.success, true);
        assert.equal(response.status, 200);
    });
});

describe("GET api artists entry /artists/", function() {
    it("Test artists home entry point", async function() {
        const response = await request(app)
            .get('/artists/');

        assert.equal(response.body.success, true);
        assert.equal(response.status, 200);
    });

    it("Test existing artist result save in CSV", async function() {
        const csv_output = "miley_cyrus.csv";

        try {
            await fsPromises.access(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, fsPromises.constants.F_OK);
            await fsPromises.rm(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`);
        } catch (error) {
            // File doesn't exist. Perfect.
        }

        const response = await request(app)
            .post('/artists/search')
            .send({
                artist_name: "Miley Cyrus",
                csv_output_filename: csv_output
            });
        assert.equal(response.body.success, true);
        assert.equal(response.status, 200);

        try {
            await fsPromises.access(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, fsPromises.constants.F_OK);
        } catch (error) {
            // File doesn't exist
            assert.equal(true, false); //Dummy fail
            return;
        }

        await fsPromises.rm(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`);
    });

    it("Test existing artist CSV File with override disabled", async function() {
        const csv_output = "miley_cyrus.csv";

        //Create the CSV file.
        try {
            await fsPromises.open(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, "w");
        } catch (error) {}

        config.ARTISTS_SEARCH_OVERRIDE_FILE = false;


        // Fetch
        const response = await request(app)
            .post('/artists/search')
            .send({
                artist_name: "Miley Cyrus",
                csv_output_filename: csv_output
            });
        assert.equal(response.body.success, false);
        assert.equal(response.status, 400);

        try {
            await fsPromises.access(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, fsPromises.constants.F_OK);
        } catch (error) {}

        await fsPromises.rm(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`);
    });

    it("Test existing artist CSV File with override enable", async function() {
        const csv_output = "miley_cyrus.csv";

        //Create the CSV file.
        try {
            await fsPromises.open(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, "w");
        } catch (error) {}

        config.ARTISTS_SEARCH_OVERRIDE_FILE = true;


        // Fetch
        const response = await request(app)
            .post('/artists/search')
            .send({
                artist_name: "Miley Cyrus",
                csv_output_filename: csv_output
            });
        assert.equal(response.body.success, true);
        assert.equal(response.status, 200);

        try {
            await fsPromises.access(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, fsPromises.constants.F_OK);
        } catch (error) {}

        await fsPromises.rm(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`);


        config.ARTISTS_SEARCH_OVERRIDE_FILE = false;
    });

    it("Test non-existing artist result in CSV File", async function() {
        this.timeout(5000); // The request is quite longer than others.

        const csv_output = "randomly_populated_with_artists.csv";

        try {
            await fsPromises.access(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, fsPromises.constants.F_OK);
            await fsPromises.rm(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`);
        } catch (error) {
            // File doesn't exist. Perfect.
        }

        // Fetch
        const response = await request(app)
            .post('/artists/search')
            .send({
                artist_name: "qsldkjqskjdqklsjdljqlksjdij_èçqsldkjqskjdqklsjdljqlksjdij_èç",
                csv_output_filename: csv_output
            });
        assert.equal(response.body.success, true);
        assert.equal(response.status, 200);

        /* -------------------------- csv file content test ------------------------- */
        
        const file = await fsPromises.open(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, "r");
        const file_content = await fsPromises.readFile(file, {encoding: "utf-8"});

        assert(file_content.split(/\r?\n/).length>=10); //The file has more than 10 lines (9 artists).

        /* -------------------------------------------------------------------------- */

        try {
            await fsPromises.access(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`, fsPromises.constants.F_OK);
        } catch (error) {}

        await fsPromises.rm(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${csv_output}`);


        config.ARTISTS_SEARCH_OVERRIDE_FILE = false;
    });
});