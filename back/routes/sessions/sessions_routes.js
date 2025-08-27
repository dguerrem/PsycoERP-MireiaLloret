const express = require("express");
const router = express.Router();

const {
  obtenerSesiones,
  crearSesion,
} = require("../../controllers/sessions/sessions_controller");

router.get("/", obtenerSesiones);
router.post("/", crearSesion);

module.exports = router;
