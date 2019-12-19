const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const getCoordinates = require("../util/location");
const Place = require("../models/placeSchema"); //Place mongoose Schema

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let specificPlace;
  try {
    specificPlace = await Place.findById(placeId); //mongoose find method
  } catch (err) {
    const error = new HttpError("Could not find a place", 500);
    return next(error);
  }

  if (!specificPlace) {
    //create an error according by error middleware + error class
    const error = new HttpError(
      "Could not find the place for the provided id",
      404
    );
    return next(error);
  } else {
    res.json({ place: specificPlace.toObject({ getters: true }) });
  }
};

const getPlacesByUserId = async (req, res) => {
  const userId = req.params.uid;

  let listOfPlacesByUser;
  try {
    listOfPlacesByUser = await Place.find({ creator: userId }); //mongoose find by prop. returns Array
  } catch (err) {
    const error = new HttpError("Fetching places failed", 500);
    return next(error);
  }

  if (!listOfPlacesByUser || listOfPlacesByUser.length === 0) {
    throw new HttpError(
      "Could not find the places for the provided user id",
      404
    );
  } else {
    res.json({
      places: listOfPlacesByUser.map(p => p.toObject({ getters: true }))
    });
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

  const createdPlace = new Place({
    title,
    description,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/220px-Empire_State_Building_from_the_Top_of_the_Rock.jpg",
    address,
    location: coordinates,
    creator
  });

  try {
    await createdPlace.save(); //save new object in mongodb
    console.log("Object created and saved");
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

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
