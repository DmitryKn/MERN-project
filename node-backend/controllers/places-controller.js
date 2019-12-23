const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordinates = require("../util/location");
const mongoose = require("mongoose");
const Place = require("../models/placeSchema"); //Place mongoose Schema
const User = require("../models/userSchema");

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
    return next(
      new HttpError("Could not find the places for the provided user id", 404)
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

  let user;
  try {
    user = await User.findById(creator); //checking if user id already in db
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for providede id", 404);
    return next(error);
  }

  try {
    //STARTING SESSION FOR DATA EXCHANGE between 'User' and 'Place' collections
    //creating new place with unique id
    const sess = await mongoose.startSession(); //1) start session
    sess.startTransaction();
    await createdPlace.save({ session: sess }); //2) save object
    user.places.push(createdPlace); //mongoose magic push()
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace }); // if object successfuly created - 201
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req); // express-validator middlware check
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
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

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator"); //find object in db
  } catch (err) {
    const error = new HttpError("Could not delete place", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  try {
    //removing data from places db and from user places array
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess }); //delete object from db
    place.creator.places.pull(place); //deleting data from user places array
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
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
