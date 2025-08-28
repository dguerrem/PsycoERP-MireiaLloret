const { getBonuses, getBonusesByPatientId, createBonus } = require("../../models/bonuses/bonuses_model");

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

const crearBonus = async (req, res) => {
  try {
    const {
      patient_id,
      total_sessions,
      price_per_session,
      total_price
    } = req.body;

    // Validaciones básicas
    if (!patient_id || !total_sessions || !price_per_session || !total_price) {
      return res.status(400).json({
        success: false,
        error: "Los campos patient_id, total_sessions, price_per_session y total_price son requeridos",
      });
    }

    // Validaciones de tipo y rango
    if (total_sessions <= 0) {
      return res.status(400).json({
        success: false,
        error: "El número de sesiones debe ser mayor a 0",
      });
    }

    if (price_per_session <= 0 || total_price <= 0) {
      return res.status(400).json({
        success: false,
        error: "Los precios deben ser mayores a 0",
      });
    }

    const bonusData = {
      patient_id,
      total_sessions,
      price_per_session,
      total_price
    };

    const bonusId = await createBonus(bonusData);

    // Obtener el bonus recién creado para devolverlo
    const nuevoBonus = await getBonusesByPatientId(patient_id);
    const bonusCreado = nuevoBonus.bonuses.find(bonus => bonus.idBono === bonusId);

    res.status(201).json({
      success: true,
      message: "Bonus creado exitosamente",
      data: bonusCreado,
    });
  } catch (err) {
    console.error("Error al crear bonus:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al crear el bonus",
    });
  }
};

module.exports = {
  obtenerBonuses,
  obtenerBonusesPorPaciente,
  crearBonus,
};
