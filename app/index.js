const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const router = require("./routes");

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

module.exports = app; //Use for tests.