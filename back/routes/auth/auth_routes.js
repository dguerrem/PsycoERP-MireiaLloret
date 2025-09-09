const express = require("express");
const router = express.Router();

const { loginUser, hashPassword } = require("../../controllers/auth/auth_controller");

router.post("/login", loginUser);
router.post("/hash-password", hashPassword);

module.exports = router;