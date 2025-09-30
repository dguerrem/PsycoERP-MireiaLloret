const { getDocumentsByPatientId } = require("../../models/documents/documents_model");

const obtenerDocumentosPorPaciente = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Validate patient_id
    if (!patient_id) {
      return res.status(400).json({
        success: false,
        error: "Patient ID is required",
      });
    }

    // Validate patient_id is a number
    if (isNaN(patient_id)) {
      return res.status(400).json({
        success: false,
        error: "Patient ID must be a valid number",
      });
    }

    const documents = await getDocumentsByPatientId(req.db, patient_id);

    res.json({
      success: true,
      total: documents.length,
      data: documents,
    });
  } catch (err) {
    console.error("Error retrieving patient documents:", err.message);
    res.status(500).json({
      success: false,
      error: "Error retrieving patient documents",
    });
  }
};

module.exports = {
  obtenerDocumentosPorPaciente,
};
