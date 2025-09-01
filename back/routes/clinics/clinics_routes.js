const express = require("express");
const router = express.Router();

const {
  obtenerClinicas,
} = require("../../controllers/clinics/clinics_controller");

router.get("/", obtenerClinicas);

module.exports = router;