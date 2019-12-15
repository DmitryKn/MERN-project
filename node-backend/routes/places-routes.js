const express = require("express");
const HttpError = require("../models/http-error");
const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Emp St Build",
    discription: "OPne",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "West 34th Street, New York, NY, USA",
    creator: "u1"
  }
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const specificPlace = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });
  if (!specificPlace) {
    //create an error according by error middleware + error class
    throw new HttpError("Could not find the place for the provided id", 404);
  } else {
    res.json({ place: specificPlace });
  }
});

router.get("/user/:uid", (req, res) => {
  const userId = req.params.uid;
  const listOfPlacesByUser = DUMMY_PLACES.filter(u => {
    return u.creator === userId;
  });

  if (listOfPlacesByUser.length === 0) {
    throw new HttpError(
      "Could not find the place for the provided user id",
      404
    );
  } else {
    res.json({ places: listOfPlacesByUser });
  }
});

module.exports = router;