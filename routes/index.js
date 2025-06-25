<<<<<<< HEAD
const express = require("express");
const AppController = require("../controllers/AppController");
const UsersController = require("../controllers/UsersController");

const router = express.Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", UsersController.postNew);
router.get("/connect", AuthController.getConnect);
router.get("/disconnect", AuthController.getDisconnect);
router.get("/users/me", UsersController.getMe);

module.exports = router;
=======
const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew); // ✅ New route

module.exports = router;
>>>>>>> c0cafd346670b8192997cdd408e9910b4b462202
