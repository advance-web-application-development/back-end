//for generate radnom token
const randToken = require("rand-token");
// hash pwd
const bcrypt = require("bcrypt");
const User = require("../user/user.model");

//variables
const jwtVariable = require("../../variables/jwt");
const { SALT_ROUNDS } = require("../../variables/auth");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "822297739446-deshsuk8vegbl4lpb1ehfpfgm7n80eim.apps.googleusercontent.com"
);
const authMethod = require("./auth.method");

//register account
exports.register = async (req, res) => {
  try {
    if (!req.body.username || (!req.body.password && !req.body.role_id)) {
      return res.status(400).send("No username or password or role found");
    }
    const username = req.body.username.toLowerCase();
    const user = await User.findOne({ username: username });
    console.log("user", user);
    if (user && user != null && user != []) {
      res.status(409).send("Username is already in use");
    } else {
      console.log("Start create account");
      const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
      const newUser = {
        username: username,
        password: hashPassword,
        role_id: req.body.role_id,
        is_activate: false,
      };
      const createUser = await User.create(newUser);
      console.log("create user", createUser);
      if (!createUser) {
        res
          .status(400)
          .send(
            "There was an error in creating an account. Please try again after few minutes"
          );
      }
      return res.send({
        username,
      });
    }
  } catch (err) {
    console.log("err ", err);
  }
};

//login account
exports.login = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  const user = await User.findOne({ username: username });
  console.log("user login ", user);
  if (!user || user == null) {
    return res.status(401).send("Account not found");
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send("Password is not valid");
  }
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const dataForAccessToken = {
    username: user.username,
  };
  const accessToken = await authMethod.generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res.status(401).send("Login failed");
  }
  // create refresh token
  let refreshToken = randToken.generate(jwtVariable.refreshTokenSize);

  if (!user.refreshToken) {
    // create user regfresh token
    await User.updateOne(
      { username: user.username },
      { refreshToken: refreshToken }
    );
  } else {
    refreshToken = user.refreshToken;
  }
  return res.json({
    msg: "Login successful",
    accessToken,
    refreshToken,
    username: user.username,
  });
};

exports.refreshToken = async (req, res) => {
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(400).send("Sorry we couldn't find access token");
  }

  //get refresh token from body
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return res.status(400).send("Sorry we couldn't find refresh token");
  }

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

  //decode access token
  const decoded = await authMethod.decodeToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!decoded) {
    return res.status(400).send("Access token is not valid");
  }

  const username = decoded.payload.username;

  const user = await userModel.getUser(username);
  if (!user) {
    return res.status(401).send("User does not exist");
  }
  if (refreshTokenFromBody !== user.refreshToken) {
    return res.status(400).send("Refresh token does not exist");
  }

  const dataForAccessToken = {
    username,
  };

  // create new access token
  const accessToken = await authMethod.generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res.status(400).send("Fail to create access token");
  }
  return res.json({
    accessToken,
  });
};
exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  console.log("token ", token);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
};
