const express = require("express");
const router = express.Router();

const {
  obtenerBonuses,
  obtenerBonusesPorPaciente,
} = require("../../controllers/bonuses/bonuses_controller");

router.get("/", obtenerBonuses);
router.get("/patient/:patient_id", obtenerBonusesPorPaciente);

module.exports = router;