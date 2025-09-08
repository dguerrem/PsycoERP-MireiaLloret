const {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getSessionForWhatsApp,
} = require("../../models/sessions/sessions_model");

const obtenerSesiones = async (req, res) => {
  try {
    const {
      patient_id,
      status,
      clinic_id,
      session_date,
      fecha_desde,
      fecha_hasta,
      payment_status,
      payment_method,
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
    if (patient_id) filters.patient_id = patient_id;
    if (status) filters.status = status;
    if (clinic_id) filters.clinic_id = clinic_id;
    if (payment_status) filters.payment_status = payment_status;
    if (payment_method) filters.payment_method = payment_method;

    // Parámetros de paginación
    filters.page = pageNum;
    filters.limit = limitNum;

    // Lógica inteligente para fechas
    if (session_date) {
      // Si envía fecha específica, usar esa
      filters.session_date = session_date;
    } else if (fecha_desde || fecha_hasta) {
      // Si envía rango, usar rango
      if (fecha_desde) filters.fecha_desde = fecha_desde;
      if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    }

    const result = await getSessions(filters);

    res.json({
      success: true,
      pagination: result.pagination,
      data: result.data,
    });
  } catch (err) {
    console.error("Error al obtener sesiones:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener las sesiones",
    });
  }
};

const crearSesion = async (req, res) => {
  try {
    const {
      patient_id,
      clinic_id,
      session_date,
      start_time,
      end_time,
      mode,
      type,
      status = "scheduled",
      price = 0.0,
      payment_method = "cash",
      payment_status = "pending",
      notes,
    } = req.body;

    // Validar campos obligatorios
    if (
      !patient_id ||
      !clinic_id ||
      !session_date ||
      !start_time ||
      !end_time ||
      !mode ||
      !type
    ) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios",
        required_fields: [
          "patient_id",
          "clinic_id",
          "session_date",
          "start_time",
          "end_time",
          "mode",
          "type",
        ],
      });
    }

    const nuevaSesion = await createSession({
      patient_id,
      clinic_id,
      session_date,
      start_time,
      end_time,
      mode,
      type,
      status,
      price,
      payment_method,
      payment_status,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Sesión creada exitosamente",
      data: nuevaSesion,
    });
  } catch (err) {
    console.error("Error al crear sesión:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al crear la sesión",
    });
  }
};

const actualizarSesion = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      clinic_id,
      session_date,
      start_time,
      end_time,
      mode,
      type,
      status,
      price,
      payment_method,
      payment_status,
      notes,
    } = req.body;

    // Validar que el ID sea válido
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID de sesión inválido",
      });
    }

    // Construir objeto con solo los campos que se envían
    const updateData = {};
    if (patient_id) updateData.patient_id = patient_id;
    if (clinic_id) updateData.clinic_id = clinic_id;
    if (session_date) updateData.session_date = session_date;
    if (start_time) updateData.start_time = start_time;
    if (end_time) updateData.end_time = end_time;
    if (mode) updateData.mode = mode;
    if (type) updateData.type = type;
    if (status) updateData.status = status;
    if (price) updateData.price = price;
    if (payment_method) updateData.payment_method = payment_method;
    if (payment_status) updateData.payment_status = payment_status;
    if (notes) updateData.notes = notes;

    // Verificar que se envió al menos un campo para actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron campos para actualizar",
      });
    }

    const sesionActualizada = await updateSession(parseInt(id), updateData);

    res.json({
      success: true,
      message: "Sesión actualizada exitosamente",
      data: sesionActualizada,
    });
  } catch (err) {
    console.error("Error al actualizar sesión:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al actualizar la sesión",
    });
  }
};

const eliminarSesion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID de sesión inválido",
      });
    }

    await deleteSession(parseInt(id));

    res.json({
      success: true,
      message: "Sesión eliminada exitosamente",
    });
  } catch (err) {
    console.error("Error al eliminar sesión:", err.message);
    
    if (err.message === "Sesión no encontrada o ya está eliminada") {
      return res.status(404).json({
        success: false,
        error: "Sesión no encontrada o ya está eliminada",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error al eliminar la sesión",
    });
  }
};

// Generar enlace de WhatsApp para recordatorio de cita
const generarEnlaceWhatsApp = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID de sesión inválido",
      });
    }

    // Obtener datos de la sesión con paciente
    const sessionData = await getSessionForWhatsApp(parseInt(id));

    if (!sessionData) {
      return res.status(404).json({
        success: false,
        error: "Sesión no encontrada",
      });
    }

    // Validar que la sesión esté programada
    if (sessionData.status === 'completed' || sessionData.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: "No se puede generar enlace para sesión completada o cancelada",
      });
    }

    // Validar que el paciente tenga teléfono
    if (!sessionData.patient_phone) {
      return res.status(400).json({
        success: false,
        error: "El paciente no tiene número de teléfono registrado",
      });
    }

    // Limpiar número de teléfono (quitar espacios, guiones, paréntesis)
    const cleanPhone = sessionData.patient_phone.replace(/[\s\-\(\)]/g, '');

    // Validar formato de teléfono básico
    if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error: "Formato de teléfono inválido",
      });
    }

    // Formatear mensaje de recordatorio
    const message = formatReminderMessage(sessionData);

    // Generar URL de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone.replace(/^\+/, '')}?text=${encodedMessage}`;

    res.json({
      success: true,
      data: {
        session_id: sessionData.session_id,
        patient_name: sessionData.patient_name,
        session_date: sessionData.session_date,
        start_time: sessionData.start_time,
        phone: cleanPhone,
        message: message,
        whatsapp_url: whatsappUrl
      }
    });

  } catch (err) {
    console.error("Error al generar enlace WhatsApp:", err.message);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

// Formatear mensaje de recordatorio
const formatReminderMessage = (sessionData) => {
  const { patient_name, type, session_date, start_time, clinic_name } = sessionData;
  
  // Formatear fecha en español
  const date = new Date(session_date);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = date.toLocaleDateString('es-ES', options);
  
  // Formatear tipo de sesión
  const sessionTypes = {
    'individual': 'individual',
    'group': 'grupal',
    'family': 'familiar',
    'couples': 'de pareja'
  };
  
  const sessionTypeText = sessionTypes[type] || type;
  
  return `Hola ${patient_name}, te recordamos tu cita de terapia ${sessionTypeText} el ${formattedDate} a las ${start_time}${clinic_name ? ` en ${clinic_name}` : ''}. ¡Te esperamos! 🌟`;
};

module.exports = {
  obtenerSesiones,
  crearSesion,
  actualizarSesion,
  eliminarSesion,
  generarEnlaceWhatsApp,
};
