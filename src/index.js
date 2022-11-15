const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const config = require("../config/config").getConfig();
//config cors
const corsOptions = {
  origin: "*",
};

//intialize port
const PORT = config.PORT;

//config dotenv
dotenv.config({ path: "../.env" });
//config db
require("../config/database");

// app use library
app.use(cors(corsOptions));
app.use(cookieParser());
// only send 1 bracket
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("This is service of our project . Today is " + new Date());
});

// app.use("/auth", authRouter);

app.use("/", (req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app
  .listen(PORT)
  .on("error", (err) => {
    console.log("✘ Application failed to start");
    console.error("✘", err.message);
    process.exit(0);
  })
  .on("listening", () => {
    console.log(`Server start listening port: http://localhost:${PORT}`);
  });
