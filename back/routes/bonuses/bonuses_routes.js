const express = require("express");
const router = express.Router();

const {
  obtenerBonuses,
  obtenerBonusesPorPaciente,
  obtenerHistorialBonus,
  crearBonus,
} = require("../../controllers/bonuses/bonuses_controller");

router.get("/", obtenerBonuses);
router.get("/patient/:patient_id", obtenerBonusesPorPaciente);
router.get("/:id/history", obtenerHistorialBonus);
router.post("/", crearBonus);

module.exports = router;