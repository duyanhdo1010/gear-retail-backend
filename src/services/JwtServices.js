const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = async (payload) => {
  const access_token = await jwt.sign(
    { ...payload },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "30s",
    }
  );

  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = await jwt.sign(
    { ...payload },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "365d",
    }
  );

  return refresh_token;
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("token: ", token);
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: "ERR",
            message: "The Authentication",
          });
        }
        const access_token = await genneralAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        resolve({
          status: "OK",
          message: "SUCCESS",
          access_token,
        });
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService,
};
