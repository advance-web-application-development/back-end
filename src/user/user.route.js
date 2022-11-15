const express = require("express");
const router = express.Router();
const authMiddleware = require("../auth/auth.middleware");

const isAuth = authMiddleware.isAuth;
router.get("/", isAuth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
