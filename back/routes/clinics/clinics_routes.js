const express = require("express");
const router = express.Router();

const {
  obtenerClinicas,
  actualizarClinica,
  eliminarClinica,
} = require("../../controllers/clinics/clinics_controller");

router.get("/", obtenerClinicas);
router.put("/:id", actualizarClinica);
router.delete("/:id", eliminarClinica);

module.exports = router;