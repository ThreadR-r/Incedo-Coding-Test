const fs = require("fs");
const config = require.main.require("./config/config");
const { stringify } = require("csv-stringify");

const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/";

const lastfm_search_artists = async (artist_name) => {
    const res = await fetch(`${LASTFM_API_URL}?method=artist.search&artist=${artist_name}&api_key=${config.LASTFM_API_KEY}&format=json`);
    const data = await res.json();

    return data.results.artistmatches.artist.map((artist) => {
        return {
            name: artist.name,
            mbid: artist.mbid,
            url: artist.url,
            image_small: artist.image.filter((image) => (image.size==="small"))[0]["#text"],
            image: artist.image.filter((image) => (image.size==="medium"))[0]["#text"]
        }
    });

};

module.exports = async (req, res) => {
    const data = await lastfm_search_artists(req.body.artist_name);
    const stringifer = stringify({
        delimiter: ";",
        header: true,
        columns: {
            name: "Name",
            mbid: "mbid",
            url: "Profile_URL",
            image_small: "img_small_URL",
            image: "img_URL",
        }
    });

    data.forEach(artist_entry => {
        stringifer.write(artist_entry);
    });

    stringifer.pipe(fs.createWriteStream(`${config.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR}${req.body.csv_output_filename}`));

    res.status(200).json({
        success: true,
        message: "Results saved."
    })
};