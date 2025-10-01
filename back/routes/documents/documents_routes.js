const express = require("express");
const router = express.Router();

const {
  obtenerDocumentosPorPaciente,
  subirDocumento,
  upload,
  descargarDocumento
} = require("../../controllers/documents/documents_controller");

router.get("/patient/:patient_id", obtenerDocumentosPorPaciente);
router.post("/", upload.single("file"), subirDocumento);
router.get("/:id/download", descargarDocumento);

module.exports = router;
