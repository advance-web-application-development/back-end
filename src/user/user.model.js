const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const User = mongoose.model(
  "User",
  new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        unique: true,
      },
      password: {
        type: String,
      },
      // role_id: {
      //   type: String,
      //   enum: ["teacher", "student"],
      // },
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
// class User {
//   initSchema() {
//     const schema = new Schema(
//       {
//         username: {
//           type: String,
//           required: true,
//           unique: true,
//         },
//         password: {
//           type: String,
//           required: true,
//           select: false,
//         },
//         role_id: {
//           type: String,
//           required: true,
//           enum: ["teacher", "student"],
//         },
//         is_deleted: {
//           type: Boolean,
//           default: false,
//         },
//         is_activated: {
//           type: Boolean,
//           default: false,
//         },
//       },
//       { timestamps: true }
//     );

//     schema.pre("save", function (next) {
//       const user = this;
//       // only hash the password if it has been modified (or is new)

//       if (this.isModified("password") || this.isNew) {
//         bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
//           if (err) {
//             return next(err);
//           }
//           bcrypt.hash(user.password, salt, (hashErr, hash) => {
//             if (hashErr) {
//               return next(hashErr);
//             }
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//           });
//         });
//       } else {
//         return next();
//       }
//     });

//     // Compare Password
//     schema.methods.comparePassword = async function (candidatePassword) {
//       return new Promise((resolve, reject) => {
//         bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(isMatch);
//           }
//         });
//       });
//     };
//     schema.statics.findByUsername = function (username) {
//       console.log("go to find by username");
//       // return this.findOne({ username: username });
//       return this.find({});
//     };
//     schema.plugin(uniqueValidator);
//     try {
//       mongoose.model("user", schema);
//     } catch (e) {}
//   }
//   getInstance() {
//     this.initSchema();
//     return mongoose.model("user");
//   }
// }
// module.exports = { User };
