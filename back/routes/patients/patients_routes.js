const express = require("express");
const router = express.Router();

const {
  obtenerPacientes,
  obtenerPacientePorId,
  eliminarPaciente,
} = require("../../controllers/patients/patients_controller");

router.get("/", obtenerPacientes);
router.get("/:id", obtenerPacientePorId);
router.delete("/:id", eliminarPaciente);

module.exports = router;