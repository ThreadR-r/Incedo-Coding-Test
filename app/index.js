const express = require("express");

var cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(limiter);


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