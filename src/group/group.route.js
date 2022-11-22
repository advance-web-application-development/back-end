const express = require("express");
const router = express.Router();

const groupController = require("./group.controller");
const authMiddleware = require("../auth/auth.middleware");

const isAuth = authMiddleware.isAuth;

// declare route
router.get("/", isAuth, groupController.getMyGroup);
router.get("/member/:id", isAuth, groupController.getGroupMember);
router.get("/owner", isAuth, groupController.getMyOwnerGroup);
router.post("/:id", isAuth, groupController.addMember);
router.post("/", isAuth, groupController.createGroup);
router.post("/toggleRole/:id", isAuth, groupController.toggleRole);
router.delete("/member/:id", isAuth, groupController.deleteMember);

module.exports = router;

