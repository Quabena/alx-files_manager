const express = require("express");
const AppController = require("../controllers/AppController");
const UsersController = require("../controllers/UsersController");
const AuthController = require("../controllers/AuthController"); // ✅ New

const router = express.Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", UsersController.postNew);
router.get("/connect", AuthController.getConnect); // ✅ Login
router.get("/disconnect", AuthController.getDisconnect); // ✅ Logout
router.get("/users/me", UsersController.getMe); // ✅ Me

module.exports = router;
