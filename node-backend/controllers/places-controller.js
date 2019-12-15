const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");

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

const getPlaceById = (req, res, next) => {
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
};

const getPlaceByUserId = (req, res) => {
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
};

const createPlace = (req, res) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace }); // if object successfuly created - 201
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
