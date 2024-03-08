const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        status: "ERR",
        message: "Unauthorized",
      });
    }
    const { payload } = user;
    if (payload?.isAdmin) {
      next();
    } else {
      return res.status(401).json({
        status: "ERR",
        message: "Unauthorized",
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];
  const userID = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        status: "ERR",
        message: "Unauthorized",
      });
    }
    const { payload } = user;
    if (payload?.isAdmin || payload?.id === userID) {
      next();
    } else {
      return res.status(401).json({
        status: "ERR",
        message: "Unauthorized",
      });
    }
  });
};

module.exports = {
  authMiddleware,
  authUserMiddleware,
};
