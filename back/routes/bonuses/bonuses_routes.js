const express = require("express");
const router = express.Router();

const {
  obtenerBonuses,
  obtenerBonusesPorPaciente,
  crearBonus,
} = require("../../controllers/bonuses/bonuses_controller");

router.get("/", obtenerBonuses);
router.get("/patient/:patient_id", obtenerBonusesPorPaciente);
router.post("/", crearBonus);

module.exports = router;