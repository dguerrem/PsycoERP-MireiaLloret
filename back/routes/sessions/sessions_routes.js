const express = require("express");
const router = express.Router();

const {
  obtenerSesiones,
  crearSesion,
  actualizarSesion,
} = require("../../controllers/sessions/sessions_controller");

router.get("/", obtenerSesiones);
router.post("/", crearSesion);
router.put("/:id", actualizarSesion);

module.exports = router;
