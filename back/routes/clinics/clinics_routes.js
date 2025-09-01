const express = require("express");
const router = express.Router();

const {
  obtenerClinicas,
  actualizarClinica,
} = require("../../controllers/clinics/clinics_controller");

router.get("/", obtenerClinicas);
router.put("/:id", actualizarClinica);

module.exports = router;