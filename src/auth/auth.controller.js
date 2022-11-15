//for generate radnom token
const randToken = require("rand-token");
// hash pwd
const bcrypt = require("bcrypt");
const { User } = require("../user/user.model");
const userModel = new User().getInstance();
//register account
exports.register = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("No username or password found");
  }
  const username = req.body.username.toLowerCase();
  const user = await userModel.findByUsername(username);
  console.log("user", user);
  if (user) {
    res.status(409).send("Username is already in use");
  } else {
    console.log("Start create account");
  }
};

//login account
exports.login = async (req, res) => {};

exports.refreshToken = async (req, res) => {};
