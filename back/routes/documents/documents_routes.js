const express = require("express");
const router = express.Router();

const { obtenerDocumentosPorPaciente } = require("../../controllers/documents/documents_controller");

router.get("/patient/:patient_id", obtenerDocumentosPorPaciente);

module.exports = router;
