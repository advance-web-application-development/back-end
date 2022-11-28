// get jwt variable
const jwtVariable = require("../../variables/jwt");

//get userModel
const { User } = require("../user/user.model");

//auth method
const authMethod = require("./auth.method");

exports.isAuth = async (req, res, next) => {
  // get access token from header
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(401).send("Cannot find access Token");
  }
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  console.log("verified ", verified);
  if (!verified) {
    return res.status(401).send("Your access token cannot verify");
  }
  console.log("username:", verified.payload.username);
  let user = await User.findOne({ username: verified.payload.username });
  // delete user.password;
  req.user = user;

  return next();
};
