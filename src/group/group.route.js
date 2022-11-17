const express = require("express");
const router = express.Router();

const groupController = require("./group.controller");
const authMiddleware = require("../auth/auth.middleware");

const isAuth = authMiddleware.isAuth;

// declare route
router.get("/", groupController.getMyGroup);
router.get("/owner", groupController.getMyOwnerGroup);
router.post("/:id", groupController.addMember);
router.post("/", groupController.createGroup);
router.post("/toggleRole/:id", groupController.toggleRole);
router.delete("/member/:id", groupController.deleteMember);

module.exports = router;

