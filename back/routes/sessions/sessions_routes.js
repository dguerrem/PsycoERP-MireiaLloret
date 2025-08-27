const express = require('express');
const router = express.Router();

const { obtenerSesiones } = require('../../controllers/sessions/sessions_controller');

// Ruta para obtener sesiones
router.get('/', obtenerSesiones);

module.exports = router;