const express = require("express");
const router = express.Router();

const {
  obtenerRecordatoriosPendientes,
} = require("../../controllers/reminders/reminders_controller");

router.get("/pending", obtenerRecordatoriosPendientes);

module.exports = router;