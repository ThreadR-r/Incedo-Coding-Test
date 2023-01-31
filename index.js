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

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const router = require("./app/routes");

app.use("/", router);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "An error occured.",
        errors: err.errors || []
    });
});

app.use((req, res) => {
    res.status(404).json({
        succes: false,
        message: "Ressource not found."
    })
});

app.listen(config.PORT, config.HOSTNAME, () => {
    console.info(`API Listening on port ${config.PORT} and hostname ${config.HOSTNAME}`);
});