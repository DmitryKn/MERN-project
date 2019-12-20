const uuid = require("uuid/v4");
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

const signup = (req, res) => {
  const error = validationResult(req); // express-validator middlware check
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed. Please check your data.", 422);
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exists.", 422);
  }

  const createdUser = {
    id: uuid(),
    name: name,
    email: email,
    password: password
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify user.", 401);
  }
  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
