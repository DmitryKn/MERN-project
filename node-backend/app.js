const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

app.use("/api/places", placesRoutes);

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
