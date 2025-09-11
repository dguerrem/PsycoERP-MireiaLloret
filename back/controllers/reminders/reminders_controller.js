const {
  getPendingReminders,
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

module.exports = {
  obtenerRecordatoriosPendientes,
};