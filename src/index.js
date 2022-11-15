const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

//config cors
const corsOptions = {
  origin: "*",
};

//config dotenv
dotenv.config({ path: "../.env" });
//config db
require("../config/database");

//initialize port
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server start listening port: http://localhost:${port}`);
});
