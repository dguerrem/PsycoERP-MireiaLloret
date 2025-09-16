const express = require("express");
const router = express.Router();

const {
  obtenerPacientes,
  obtenerPacientePorId,
  obtenerPacientesEliminados,
  eliminarPaciente,
  crearPaciente,
} = require("../../controllers/patients/patients_controller");

router.get("/", obtenerPacientes);
router.post("/", crearPaciente);
router.get("/deleted", obtenerPacientesEliminados);
router.get("/:id", obtenerPacientePorId);
router.delete("/:id", eliminarPaciente);

module.exports = router;