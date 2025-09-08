const express = require("express");
const router = express.Router();

const {
  crearNotaClinica,
  actualizarNotaClinica,
  eliminarNotaClinica,
} = require("../../controllers/clinical_notes/clinical_notes_controller");

// Crear nueva nota clínica
router.post("/", crearNotaClinica);

// Actualizar nota clínica
router.put("/:id", actualizarNotaClinica);

// Eliminar nota clínica
router.delete("/:id", eliminarNotaClinica);

module.exports = router;