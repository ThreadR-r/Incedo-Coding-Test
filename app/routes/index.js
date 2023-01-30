const express = require("express");

const router = express.Router();

router.use((req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome in the API."
    });
});

module.exports = router;