const express = require("express");
const router = express.Router();

const {
  obtenerPacientes,
} = require("../../controllers/patients/patients_controller");

router.get("/", obtenerPacientes);

module.exports = router;