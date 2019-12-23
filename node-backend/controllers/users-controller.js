const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/userSchema");

const getUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await User.find();
  } catch (err) {
    const error = new HttpError("Could not get user list", 500);
    return nexr(error);
  }
  res.json({ users: allUsers.map(u => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req); // express-validator middlware check
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Sign up failed.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exist already. Please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image: "pic",
    places
  });
  console.log(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed. Could not save new user in database",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Could not identify user.", 401));
  }
  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
