const {
  getPatients,
  getPatientById,
  getDeletedPatients,
  deletePatient,
  createPatient,
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

const crearPaciente = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      dni,
      gender,
      occupation,
      birth_date,
      street,
      street_number,
      door,
      postal_code,
      city,
      province,
      session_price,
      clinic_id,
      treatment_start_date,
      status,
      is_minor,
    } = req.body;

    // Validaciones obligatorias
    if (!first_name || !last_name || !email || !phone || !dni) {
      return res.status(400).json({
        success: false,
        error: "Los campos first_name, last_name, email, phone y dni son obligatorios",
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "El formato del email no es válido",
      });
    }

    // Validación de género
    if (gender && !["M", "F", "O"].includes(gender)) {
      return res.status(400).json({
        success: false,
        error: "El género debe ser M, F o O",
      });
    }

    // Validación de status
    const validStatuses = ["en curso", "fin del tratamiento", "en pausa", "abandono", "derivación"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "El status debe ser uno de: " + validStatuses.join(", "),
      });
    }

    // Validación de clinic_id
    if (clinic_id && isNaN(clinic_id)) {
      return res.status(400).json({
        success: false,
        error: "El clinic_id debe ser un número válido",
      });
    }

    // Validación de session_price
    if (session_price && (isNaN(session_price) || session_price < 0)) {
      return res.status(400).json({
        success: false,
        error: "El precio de sesión debe ser un número válido mayor o igual a 0",
      });
    }

    // Validación de is_minor
    if (is_minor !== undefined && typeof is_minor !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "El campo is_minor debe ser un valor booleano",
      });
    }

    const patientData = {
      first_name,
      last_name,
      email,
      phone,
      dni,
      gender: gender || "O",
      occupation,
      birth_date,
      street,
      street_number,
      door,
      postal_code,
      city,
      province,
      session_price,
      clinic_id,
      treatment_start_date,
      status: status || "en curso",
      is_minor,
    };

    const nuevoPaciente = await createPatient(patientData);

    res.status(201).json({
      success: true,
      data: nuevoPaciente,
      message: "Paciente creado exitosamente",
    });
  } catch (err) {
    console.error("Error al crear paciente:", err.message);

    // Manejo de errores específicos de base de datos
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.message.includes('email')) {
        return res.status(409).json({
          success: false,
          error: "El email ya está registrado para otro paciente",
        });
      }
      if (err.message.includes('dni')) {
        return res.status(409).json({
          success: false,
          error: "El DNI ya está registrado para otro paciente",
        });
      }
    }

    res.status(500).json({
      success: false,
      error: "Error al crear el paciente",
    });
  }
};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  obtenerPacientesEliminados,
  eliminarPaciente,
  crearPaciente,
};