const express = require("express");
const router = express.Router();
const authMiddleware = require("../auth/auth.middleware");
const userController = require("./user.controller");

const isAuth = authMiddleware.isAuth;
router.get("/", isAuth, async (req, res) => {
  res.send({ user: req.user });
});
router.get("/list", userController.getAllUser);

module.exports = router;
