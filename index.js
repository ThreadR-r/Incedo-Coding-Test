console.info(`Running Incedo Artists exporter REST API in ${process.env.NODE_ENV} mode`);

const config = require("./config/config");

// Load environments variables according to the running mode. (prod, dev or staging)
config.load_env();

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