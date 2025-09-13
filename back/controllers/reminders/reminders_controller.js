const {
  getPendingReminders,
  createReminder,
} = require("../../models/reminders/reminders_model");

const obtenerRecordatoriosPendientes = async (req, res) => {
  try {
    const result = await getPendingReminders();
    
    // Determinar el día de la semana actual para el mensaje
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    let dayDescription;
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      dayDescription = "mañana";
    } else {
      dayDescription = "el próximo lunes";
    }
    
    res.json({
      success: true,
      data: result.sessions,
      total: result.total,
      message: `Sesiones programadas para ${dayDescription} (${result.targetDate})`,
      metadata: {
        targetDate: result.targetDate,
        currentDay: dayOfWeek,
        description: `Sesiones de ${dayDescription}`
      }
    });
  } catch (err) {
    console.error("Error al obtener recordatorios pendientes:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener los recordatorios pendientes",
      message: "Ha ocurrido un error interno del servidor"
    });
  }
};

const crearRecordatorio = async (req, res) => {
  try {
    const { session_id } = req.body;

    // Validar que se proporcione el session_id
    if (!session_id || isNaN(session_id)) {
      return res.status(400).json({
        success: false,
        error: "session_id es requerido y debe ser un número válido",
        message: "Debe proporcionar un ID de sesión válido"
      });
    }

    const reminder = await createReminder(parseInt(session_id));

    res.status(201).json({
      success: true,
      data: reminder,
      message: "Recordatorio creado exitosamente"
    });
  } catch (err) {
    console.error("Error al crear recordatorio:", err.message);
    
    // Manejar errores específicos
    if (err.message === "Session not found or not scheduled") {
      return res.status(404).json({
        success: false,
        error: "Sesión no encontrada o no está programada",
        message: "La sesión debe existir y estar en estado 'programada'"
      });
    }
    
    if (err.message === "Reminder already exists for this session") {
      return res.status(409).json({
        success: false,
        error: "Ya existe un recordatorio para esta sesión",
        message: "No se puede crear un recordatorio duplicado"
      });
    }

    res.status(500).json({
      success: false,
      error: "Error al crear el recordatorio",
      message: "Ha ocurrido un error interno del servidor"
    });
  }
};

module.exports = {
  obtenerRecordatoriosPendientes,
  crearRecordatorio,
};