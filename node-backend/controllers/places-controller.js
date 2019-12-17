const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const getCoordinates = require("../util/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Emp St Build",
    description: "OPne",
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

const getPlacesByUserId = (req, res) => {
  const userId = req.params.uid;
  const listOfPlacesByUser = DUMMY_PLACES.filter(u => {
    return u.creator === userId;
  });

  if (!listOfPlacesByUser || listOfPlacesByUser.length === 0) {
    throw new HttpError(
      "Could not find the places for the provided user id",
      404
    );
  } else {
    res.json({ places: listOfPlacesByUser });
  }
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req); // express-validator middlware check
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates; //using google api midddleware address => coordinates
  try {
    coordinates = await getCoordinates(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates, //google coordinates
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace }); // if object successfuly created - 201
};

const updatePlace = (req, res) => {
  const error = validationResult(req); // express-validator middlware check
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed. Please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; //creating copy for changes
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace; // change copy

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id.", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({ message: "Deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
