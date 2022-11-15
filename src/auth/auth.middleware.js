// get jwt variable
const jwtVariable = require("../../variables/jwt");

//get userModel
const userModel = require("../users/users.model");

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

  if (!verified) {
    return res.status(401).send("Your access token cannot verify");
  }
  const user = await userModel.getUser(verified.payload.username);
  req.user = user;

  return next();
};
