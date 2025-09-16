const {
  getPatients,
  getPatientById,
  getDeletedPatients,
  deletePatient,
} = require("../../models/patients/patients_model");

const obtenerPacientes = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      dni,
      status,
      gender,
      occupation,
      clinic_id,
      is_minor,
      birth_date,
      fecha_desde,
      fecha_hasta,
      page,
      limit,
    } = req.query;

    // Validar parámetros de paginación
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    // Validaciones de límites
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: "El número de página debe ser mayor a 0",
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: "El límite debe estar entre 1 y 100 registros",
      });
    }
    
    // Construir filtros incluyendo paginación
    const filters = {};
    if (first_name) filters.first_name = first_name;
    if (last_name) filters.last_name = last_name;
    if (email) filters.email = email;
    if (dni) filters.dni = dni;
    if (status) filters.status = status;
    if (gender) filters.gender = gender;
    if (occupation) filters.occupation = occupation;
    if (clinic_id) filters.clinic_id = clinic_id;
    if (is_minor !== undefined) filters.is_minor = is_minor;

    // Parámetros de paginación
    filters.page = pageNum;
    filters.limit = limitNum;

    // Lógica inteligente para fechas de nacimiento
    if (birth_date) {
      // Si envía fecha específica, usar esa
      filters.birth_date = birth_date;
    } else if (fecha_desde || fecha_hasta) {
      // Si envía rango, usar rango para fecha de creación
      if (fecha_desde) filters.fecha_desde = fecha_desde;
      if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    }

    const result = await getPatients(filters);

    res.json({
      success: true,
      pagination: result.pagination,
      data: result.data,
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
        PatientMedicalRecord: pacienteData.PatientMedicalRecord,
        PatientSessions: pacienteData.PatientSessions,
        PatientInvoice: [],
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

const obtenerPacientesEliminados = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      dni,
      status,
      gender,
      occupation,
      clinic_id,
      is_minor,
      birth_date,
      fecha_desde,
      fecha_hasta,
      page,
      limit,
    } = req.query;

    // Validar parámetros de paginación
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    // Validaciones de límites
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: "El número de página debe ser mayor a 0",
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: "El límite debe estar entre 1 y 100 registros",
      });
    }
    
    // Construir filtros incluyendo paginación
    const filters = {};
    if (first_name) filters.first_name = first_name;
    if (last_name) filters.last_name = last_name;
    if (email) filters.email = email;
    if (dni) filters.dni = dni;
    if (status) filters.status = status;
    if (gender) filters.gender = gender;
    if (occupation) filters.occupation = occupation;
    if (clinic_id) filters.clinic_id = clinic_id;
    if (is_minor !== undefined) filters.is_minor = is_minor;

    // Parámetros de paginación
    filters.page = pageNum;
    filters.limit = limitNum;

    // Lógica inteligente para fechas de nacimiento
    if (birth_date) {
      // Si envía fecha específica, usar esa
      filters.birth_date = birth_date;
    } else if (fecha_desde || fecha_hasta) {
      // Si envía rango, usar rango para fecha de creación
      if (fecha_desde) filters.fecha_desde = fecha_desde;
      if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    }

    const result = await getDeletedPatients(filters);

    res.json({
      success: true,
      pagination: result.pagination,
      data: result.data,
    });
  } catch (err) {
    console.error("Error al obtener pacientes eliminados:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener los pacientes eliminados",
    });
  }
};

const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID del paciente es requerido",
      });
    }

    const eliminado = await deletePatient(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        error: "Paciente no encontrado o ya está eliminado",
      });
    }

    res.json({
      success: true,
      message: "Paciente eliminado correctamente",
    });
  } catch (err) {
    console.error("Error al eliminar paciente:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al eliminar el paciente",
    });
  }
};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  obtenerPacientesEliminados,
  eliminarPaciente,
};