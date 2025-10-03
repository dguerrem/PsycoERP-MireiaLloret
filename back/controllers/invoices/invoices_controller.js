const { getInvoicesKPIs, getPendingInvoices } = require("../../models/invoices/invoice_model");

// Obtener KPIs de facturación
const obtenerKPIsFacturacion = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validar parámetros si se envían
    if (month && (isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12)) {
      return res.status(400).json({
        success: false,
        error: "El mes debe ser un número entre 1 y 12"
      });
    }

    if (year && (isNaN(parseInt(year)) || parseInt(year) < 2000)) {
      return res.status(400).json({
        success: false,
        error: "El año debe ser un número válido mayor a 2000"
      });
    }

    const filters = {};
    if (month) filters.month = parseInt(month);
    if (year) filters.year = parseInt(year);

    const kpis = await getInvoicesKPIs(req.db, filters);

    res.json({
      success: true,
      data: kpis
    });
  } catch (err) {
    console.error("Error al obtener KPIs de facturación:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener los KPIs de facturación"
    });
  }
};

// Obtener sesiones pendientes de facturar
const obtenerFacturasPendientes = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validar parámetros si se envían
    if (month && (isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12)) {
      return res.status(400).json({
        success: false,
        error: "El mes debe ser un número entre 1 y 12"
      });
    }

    if (year && (isNaN(parseInt(year)) || parseInt(year) < 2000)) {
      return res.status(400).json({
        success: false,
        error: "El año debe ser un número válido mayor a 2000"
      });
    }

    const filters = {};
    if (month) filters.month = parseInt(month);
    if (year) filters.year = parseInt(year);

    const pendingData = await getPendingInvoices(req.db, filters);

    res.json({
      success: true,
      data: pendingData
    });
  } catch (err) {
    console.error("Error al obtener facturas pendientes:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener las facturas pendientes"
    });
  }
};

module.exports = {
  obtenerKPIsFacturacion,
  obtenerFacturasPendientes
};
