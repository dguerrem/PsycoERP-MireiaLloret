const express = require("express");
const router = express.Router();

const {
  obtenerPacientes,
  obtenerPacientePorId,
} = require("../../controllers/patients/patients_controller");

router.get("/", obtenerPacientes);
router.get("/:id", obtenerPacientePorId);

module.exports = router;