const {
  getDashboardKPIs,
} = require("../../models/dashboard/dashboard_model");

const obtenerDashboardKPIs = async (req, res) => {
  try {
    const rapidKPIData = await getDashboardKPIs();

    res.json({
      success: true,
      data: rapidKPIData,
    });
  } catch (err) {
    console.error("Error al obtener KPIs del dashboard:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener los KPIs del dashboard",
    });
  }
};

module.exports = {
  obtenerDashboardKPIs,
};