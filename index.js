console.info(`Running Incedo Artists exporter REST API in ${process.env.NODE_ENV} mode`);

// Load environments variables according to the running mode. (prod, dev or staging)
(function load_env() {
    require("dotenv").config({
        path: `.env.${process.env.NODE_ENV}`
    });

    if (!process.env.LASTFM_API_KEY) {
        throw new Error("Critical LastFM API Key not given. Exiting...");
    }
})();

const config = require("./config/config");

const app = require("./app");

app.listen(config.PORT, config.HOSTNAME, () => {
    console.info(`API Listening on port ${config.PORT} and hostname ${config.HOSTNAME}`);
});