const express = require("express");

const router = express.Router();

// Router Configuration
router.use(express.json());
router.use(express.urlencoded({ extended: true}));

// Other routes
const artists_route = require("./artists");
router.use("/artists/", artists_route);

// Home entry point
router.use((req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome in the API."
    });
});


module.exports = router;