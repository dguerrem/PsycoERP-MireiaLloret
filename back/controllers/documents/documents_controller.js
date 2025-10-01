const {
  getDocumentsByPatientId,
  uploadDocument,
  getDocumentById,
} = require("../../models/documents/documents_model");

const { getPatientById } = require("../../models/patients/patients_model");
const { uploadFileToVPS } = require("../../utils/sftp");

const multer = require("multer");
const path = require("path");

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

// Configuración de multer para validación de archivos
const storage = multer.memoryStorage(); // Guardamos en memoria temporalmente

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo PDF, JPG, PNG, DOC, DOCX son aceptados."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB en bytes
  },
});

const subirDocumento = async (req, res) => {
  try {
    const { patient_id, description } = req.body;

    // Validar patient_id
    if (!patient_id) {
      return res.status(400).json({
        success: false,
        error: "El patient_id es obligatorio",
      });
    }

    // Validar que el paciente existe
    const patient = await getPatientById(req.db, parseInt(patient_id));
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Paciente no encontrado",
      });
    }

    // Validar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionó ningún archivo",
      });
    }

    // Validar descripción
    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "La descripción es obligatoria",
      });
    }

    // Subir archivo al VPS via SFTP
    console.log(`📤 Subiendo archivo al VPS para paciente ${patient_id}...`);
    const fileUrl = await uploadFileToVPS(
      req.file.buffer,
      req.file.originalname,
      parseInt(patient_id)
    );
    console.log(`✅ Archivo subido exitosamente: ${fileUrl}`);

    // Guardar documento en la base de datos (size en bytes)
    const documentData = {
      patient_id: parseInt(patient_id),
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size, // Guardamos en bytes
      description: description.trim(),
      file_url: fileUrl, // URL real del VPS
    };

    const newDocument = await uploadDocument(req.db, documentData);

    res.status(201).json({
      success: true,
      message: "Documento subido correctamente",
      data: newDocument,
    });
  } catch (err) {
    console.error("Error al subir documento:", err.message);

    // Manejar errores específicos de multer
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          error: "El archivo excede el tamaño máximo permitido de 10MB",
        });
      }
      return res.status(400).json({
        success: false,
        error: `Error al procesar el archivo: ${err.message}`,
      });
    }

    res.status(500).json({
      success: false,
      error: "Error al subir el documento",
    });
  }
};

const descargarDocumento = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "El ID es obligatorio" });
    }

    const document = await getDocumentById(req.db, id);

    if (!document) {
      return res
        .status(404)
        .json({ success: false, error: "Documento no encontrado" });
    }

    return res.json({
      success: true,
      file_url: document.file_url,
    });
  } catch (err) {
    console.error("Error al descargar documento:", err.message);
    res
      .status(500)
      .json({ success: false, error: "Error al descargar el documento" });
  }
};

module.exports = {
  obtenerDocumentosPorPaciente,
  subirDocumento,
  upload, // Exportar el middleware de multer
  descargarDocumento,
};
