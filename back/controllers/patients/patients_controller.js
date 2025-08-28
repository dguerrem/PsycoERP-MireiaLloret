const {
  getPatients,
  getPatientById,
} = require("../../models/patients/patients_model");

const obtenerPacientes = async (req, res) => {
  try {
    const {
      name,
      email,
      dni,
      status,
      session_type,
      insurance_provider,
      referred_by,
      birth_date,
      fecha_desde,
      fecha_hasta,
    } = req.query;

    
    // Construir filtros directamente
    const filters = {};
    if (name) filters.name = name;
    if (email) filters.email = email;
    if (dni) filters.dni = dni;
    if (status) filters.status = status;
    if (session_type) filters.session_type = session_type;
    if (insurance_provider) filters.insurance_provider = insurance_provider;
    if (referred_by) filters.referred_by = referred_by;

    // Lógica inteligente para fechas de nacimiento
    if (birth_date) {
      // Si envía fecha específica, usar esa
      filters.birth_date = birth_date;
    } else if (fecha_desde || fecha_hasta) {
      // Si envía rango, usar rango para fecha de creación
      if (fecha_desde) filters.fecha_desde = fecha_desde;
      if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    }

    const pacientes = await getPatients(filters);

    res.json({
      success: true,
      total: pacientes.length,
      data: pacientes,
    });
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener los pacientes",
    });
  }
};

const obtenerPacientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID del paciente es requerido",
      });
    }

    const pacienteData = await getPatientById(id);

    if (!pacienteData.PatientResume) {
      return res.status(404).json({
        success: false,
        error: "Paciente no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        PatientResume: pacienteData.PatientResume,
        PatientData: pacienteData.PatientData,
        PatientMedicalRecord: [],
        PatientSessions: pacienteData.PatientSessions,
        PatientInvoice: [],
        PatientBonus: pacienteData.PatientBonus,
      },
    });
  } catch (err) {
    console.error("Error al obtener paciente por ID:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener el paciente",
    });
  }
};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
};