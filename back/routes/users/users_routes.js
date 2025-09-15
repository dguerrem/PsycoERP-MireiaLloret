const express = require("express");
const router = express.Router();

const {
  obtenerUsuarioPorId,
} = require("../../controllers/users/users_controller");

router.get("/:id", obtenerUsuarioPorId);

module.exports = router;