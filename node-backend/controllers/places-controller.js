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
      //converting mongoose object => js object
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

const updatePlace = async (req, res, next) => {
  const error = validationResult(req); // express-validator middlware check
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed. Please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not update place", 500);
    return next(error);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError("Could not update place", 500);
    return next(error);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId); //find object in db
  } catch (err) {
    const error = new HttpError("Could not delete place", 500);
    return next(error);
  }

  try {
    await place.remove(placeId); //delete object in db
  } catch (err) {
    const error = new HttpError("Could not delete place", 500);
    return next(error);
  }

  res.status(200).json({ message: "Place deleted successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
