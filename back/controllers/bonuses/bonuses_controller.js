const {
  getBonuses,
} = require("../../models/bonuses/bonuses_model");

const obtenerBonuses = async (req, res) => {
  try {
    const {
      patient_id,
      status,
      fecha_desde,
      fecha_hasta,
    } = req.query;

    console.log('Query Params:', req.query);
    
    // Construir filtros directamente
    const filters = {};
    if (patient_id) filters.patient_id = patient_id;
    if (status) filters.status = status;
    if (fecha_desde) filters.fecha_desde = fecha_desde;
    if (fecha_hasta) filters.fecha_hasta = fecha_hasta;

    const bonuses = await getBonuses(filters);

    res.json({
      success: true,
      total: bonuses.length,
      data: bonuses,
    });
  } catch (err) {
    console.error("Error al obtener bonuses:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener los bonuses",
    });
  }
};

module.exports = {
  obtenerBonuses,
};