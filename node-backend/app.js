const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-route");

const app = express();
app.use(bodyParser.json());

//middleware for user images
app.use("/uploads/images/", express.static(path.join("uploads", "images")));

//frontend for 1 server solution
app.use(express.static(path.join("public")));

//add some headers to solve a CORS problem. Not needed if 1 server solution
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //allows any domain send requests
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

//1 server solution. Always return index.html
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

/*  if we have frontend, wrong routes not needed
app.use((req, res) => {
  //middleware for the wrong routes
  const error = new HttpError("Could not find this route", 404);
  throw error;
});
*/

//special middleware for error handling
app.use((error, req, res, next) => {
  if (req.file) {
    //delete pic from req, if signup was failed
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

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
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-volzv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000); //heroku port or local
  })
  .catch(error => {
    console.log("Something wrong", error);
  });
