const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// dung de cho phep cac domain khac co the truy cap vao server
app.use(cors());

// dung de cho phep truy cap vao cac file static
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

app.listen(port, () => {
  console.log("Server is running in port " + port);
});
