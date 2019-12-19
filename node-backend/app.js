const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-route");

const app = express();
app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  //middleware for the wrong routes
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

mongoose
  .connect(
    "mongodb+srv://Dimko:XDQ4LErWsh3qCGXz@cluster0-volzv.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000, console.log("Server running port:5000"));
  })
  .catch(error => {
    console.log("Something wrong", error);
  });
