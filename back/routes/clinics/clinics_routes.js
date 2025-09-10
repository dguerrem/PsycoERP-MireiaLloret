const express = require("express");
const router = express.Router();

const {
  obtenerClinicas,
  obtenerClinicasEliminadas,
  crearClinica,
  actualizarClinica,
  eliminarClinica,
} = require("../../controllers/clinics/clinics_controller");

router.get("/", obtenerClinicas);
router.get("/deleted", obtenerClinicasEliminadas);
router.post("/", crearClinica);
router.put("/:id", actualizarClinica);
router.delete("/:id", eliminarClinica);

module.exports = router;