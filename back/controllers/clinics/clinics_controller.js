const {
  getClinics,
} = require("../../models/clinics/clinics_model");

const obtenerClinicas = async (req, res) => {
  try {
    const {
      name,
    } = req.query;

    const filters = {};
    if (name) filters.name = name;

    const clinicas = await getClinics(filters);

    res.json({
      success: true,
      total: clinicas.length,
      data: clinicas,
    });
  } catch (err) {
    console.error("Error al obtener clínicas:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener las clínicas",
    });
  }
};

module.exports = {
  obtenerClinicas,
};