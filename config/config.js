module.exports = {
    PORT: process.env.PORT || 8080,
    HOSTNAME: process.env.HOSTNAME || "127.0.0.1"
}

module.exports.load_env = () => {
    require("dotenv").config({
        path: `.env.${process.env.NODE_ENV}`
    });
}