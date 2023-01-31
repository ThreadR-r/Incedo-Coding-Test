const fs = require("fs");
const config = require("../../../config/config");
const { stringify } = require("csv-stringify");

const LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/";

const lastfm_search_artists = async (artist_name) => {
    const res = await fetch(`${LASTFM_API_URL}?method=artist.search&artist=${artist_name}&api_key=${config.LASTFM_API_KEY}&format=json`);
    const data = await res.json();

    if (res.status!==200) {
        const err = new Error("Error fetching LastFM API");
        err.errors = [data.message];
        err.statusCode = res.status;
        throw err;
    }
    
    const return_data = data.results.artistmatches.artist.map((artist) => {
        return {
            name: artist.name,
            mbid: artist.mbid,
            url: artist.url,
            image_small: artist.image.filter((image) => (image.size==="small"))[0]["#text"],
            image: artist.image.filter((image) => (image.size==="medium"))[0]["#text"]
        }
    });

    return (return_data.length===0 ? null : return_data);
};

const lastfm_get_random_artists = async () => {
    var open_random_artist_list = config.FALLBACK_RANDOM_ARTISTS_NAME.slice();

    var data = [];

    for (var i=0; i<config.FALLBACK_NB_ARTISTS_FETCH; i++) {
        const artist_index = Math.floor(Math.random()*open_random_artist_list.length); //Getting a random artist
        const artist_name = open_random_artist_list[artist_index];
        open_random_artist_list = open_random_artist_list.filter((value, index) => index!==artist_index); //Removing it from the open array

        data.push(...(await lastfm_search_artists(artist_name)));
    }

    data = data.sort((a, b) => (-0.5 + Math.random())); // Shuffle artists. (Arbitrary Choice Made)
    
    return data;
};

module.exports = async (req, res, next) => {
    var data = null;
    try {
        data = (await lastfm_search_artists(req.body.artist_name)) || (await lastfm_get_random_artists());
    } catch (error) { // Could happen if LastFM API is down.
        return next(error); //Usage of next because of this being an async function.
    }

    const stringifer = stringify({
        delimiter: ", ",
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