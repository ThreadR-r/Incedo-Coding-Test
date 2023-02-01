const express = require("express");

const router = express.Router();

const search_endpoint = require("../../controllers/search.controller");
const SearchValidation = require("../../middlewares/artists/search");
router.post("/search", SearchValidation, search_endpoint);

router.use("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Artists entry point."
    })
});

module.exports = router;