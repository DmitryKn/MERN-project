const express = require("express");

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
  },
  {
    id: "p2",
    title: "Emp St Build 2",
    discription: "OPne 2",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "West 34th Street, New York, NY, USA",
    creator: "u1"
  }
];

module.exports = router;
