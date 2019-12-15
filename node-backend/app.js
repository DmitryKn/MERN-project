const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(bodyParser.json());
app.use("/api/places", placesRoutes);
app.use((req, res) => {
  //middware for wrong routes
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//special middleware for error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    // if response already sended -> only error
    return next(error);
  } else {
    // if nothing -> error + message
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error ocurred!" });
  }
});

app.listen(5000, (req, res) => {
  console.log("Server is working");
});
