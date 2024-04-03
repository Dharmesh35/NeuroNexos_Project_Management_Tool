const User = require("../models/user");
const Team = require("../models/team");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const genTokenAndSetCookie = require("../utils/genTokenAndSetCookie");

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPass = bcrypt.hashSync(password);

    const user = new User({
      name,
      email,
      password: hashedPass,
    });
    await user.save();

    genTokenAndSetCookie(user, res);
    return res.status(201).json({ msg: "Registered Succesfully!!" });
  } catch (error) {
    if (error.code == 11000 && error.keyPattern.email == 1) {
      return res
        .status(400)
        .json({ msg: "User already exists!! Please login" });
    }
    return res.status(500).json({ msg: "Unexpected error occured !!", error });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not found !!" });
    }

    const result = bcrypt.compareSync(password, user.password); //order matter ; first given pass, then user.pass
    if (!result) {
      return res.status(400).json({ msg: "Wrong Password !!" });
    }
    genTokenAndSetCookie(user, res);
    return res.status(200).json({ msg: "Loggedin Succesfully!!" });
  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error occured !!", error });
  }
};

const getUser = async (req, res, next) => {
  const id = req.id;
  const user = await User.findById(id, "-password")
    .populate("projects")
    .populate("teams");
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  return res.status(200).json(user);
};

const logout = async (req, res, next) => {
  const cookie = req.headers.cookie;
  const token = cookie.split("=")[1];
  if (!token) {
    return res.status(404).json({ msg: "Token not found" });
  }
  jwt.verify(String(token), process.env.JWT_SECERT, (err, data) => {
    if (err) {
      return res.status(400).json({ msg: "Invalid Token" });
    }
    res.clearCookie(`${data.user}`);
    req.cookies[`${data.user}`] = "";
    return res.status(200).json({ msg: "Succesfully logged out!!" });
  });
};

const getTeams = async (req, res, next) => {
  try {
    const id = req.id;
    const users = await User.findById(id);
    const teamNames = [];

    for (const teamID of users.teams) {
      const team = await Team.findById(teamID);
      if (team) {
        teamNames.push({ id: teamID, title: team.title });
      }
    }
    return res.status(200).json({ names: teamNames });
  } catch (err) {
    return res.status(500);
  }
};

exports.signup = signup;
exports.login = login;
exports.getUser = getUser;
exports.logout = logout;
exports.getTeams = getTeams;
