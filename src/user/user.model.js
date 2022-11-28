const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const User = mongoose.model(
  "User",
  new Schema(
    {
      id: {
        type: String,
        unique: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
      },
      is_deleted: {
        type: Boolean,
        default: false,
      },
      is_activated: {
        type: Boolean,
        default: false,
      },
      refreshToken: {
        type: String,
      },
      confirmationCode: {
        type: String,
      },
    },
    { timestamps: true }
  )
);
module.exports = User;
module.exports.getUserByUsername = function (username) {
  var query = { username: username };
  return User.findOne(query);
};
