const { getSessions } = require("../../models/sessions/sessions_model");

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
    } = req.query;

    // Construir filtros directamente
    const filters = {};
    if (patient_id) filters.patient_id = patient_id;
    if (status) filters.status = status;
    if (clinic_id) filters.clinic_id = clinic_id;
    if (payment_status) filters.payment_status = payment_status;
    if (payment_method) filters.payment_method = payment_method;

    // Lógica inteligente para fechas
    if (session_date) {
      // Si envía fecha específica, usar esa
      filters.session_date = session_date;
    } else if (fecha_desde || fecha_hasta) {
      // Si envía rango, usar rango
      if (fecha_desde) filters.fecha_desde = fecha_desde;
      if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    }

    const sesiones = await getSessions(filters);

    res.json({
      success: true,
      total: sesiones.length,
      data: sesiones,
    });
  } catch (err) {
    console.error("Error al obtener sesiones:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener las sesiones",
    });
  }
};

module.exports = {
  obtenerSesiones,
};
