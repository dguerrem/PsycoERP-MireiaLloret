const { getBonuses, getBonusesByPatientId } = require("../../models/bonuses/bonuses_model");

const obtenerBonuses = async (req, res) => {
  try {
    const { patient_id, status, fecha_desde, fecha_hasta } = req.query;

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

const obtenerBonusesPorPaciente = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        error: "ID del paciente es requerido",
      });
    }

    const bonusesData = await getBonusesByPatientId(patient_id);

    res.json({
      success: true,
      data: {
        kpis: bonusesData.kpis,
        bonuses: bonusesData.bonuses,
      },
    });
  } catch (err) {
    console.error("Error al obtener bonuses por paciente:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener los bonuses del paciente",
    });
  }
};

module.exports = {
  obtenerBonuses,
  obtenerBonusesPorPaciente,
};
