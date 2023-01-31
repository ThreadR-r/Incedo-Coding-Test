module.exports = {
    PORT: parseInt(process.env.PORT) || 8080,
    HOSTNAME: process.env.HOSTNAME || "127.0.0.1",
    LASTFM_API_KEY: process.env.LASTFM_API_KEY,

    ARTISTS_SEARCH_RESULTS_OUTPUT_DIR: process.env.ARTISTS_SEARCH_RESULTS_OUTPUT_DIR || "./output/",
    ARTISTS_SEARCH_OVERRIDE_FILE: process.env.ARTISTS_SEARCH_OVERRIDE_FILE || false,

    FALLBACK_RANDOM_ARTISTS_NAME: ["Polaris", "Of Mice & Men", "Rachmaninoff", "Dance Gavin Dance", "Nina", "Chopin"],
    FALLBACK_NB_ARTISTS_FETCH: 3
};