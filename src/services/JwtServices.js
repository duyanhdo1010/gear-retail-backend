const jwt = require("jsonwebtoken");

const genneralAccessToken = async (payload) => {
    const access_token = await jwt.sign({ payload }, "access-token", {
        expiresIn: "1h",
    });

    return access_token;
};

const genneralRefreshToken = async (payload) => {
    const refresh_token = await jwt.sign({ payload }, "refresh-token", {
        expiresIn: "365d",
    });

    return refresh_token;
};

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
};
