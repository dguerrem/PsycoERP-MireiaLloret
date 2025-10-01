const express = require("express");
const router = express.Router();

const {
  obtenerDocumentosPorPaciente,
  subirDocumento,
  upload
} = require("../../controllers/documents/documents_controller");

router.get("/patient/:patient_id", obtenerDocumentosPorPaciente);
router.post("/", upload.single("file"), subirDocumento);

module.exports = router;
