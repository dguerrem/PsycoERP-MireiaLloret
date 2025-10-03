const { getInvoicesKPIs, getPendingInvoices, createInvoice, getIssuedInvoices } = require("../../models/invoices/invoice_model");

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

// Generar factura
const generarFactura = async (req, res) => {
  try {
    const {
      invoice_number,
      invoice_date,
      patient_id,
      session_ids,
      concept
    } = req.body;

    // Validaciones básicas
    if (!invoice_number || !invoice_date || !patient_id || !session_ids || !concept) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios: invoice_number, invoice_date, patient_id, session_ids, concept"
      });
    }

    if (!Array.isArray(session_ids) || session_ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: "session_ids debe ser un array con al menos un ID"
      });
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(invoice_date)) {
      return res.status(400).json({
        success: false,
        error: "El formato de invoice_date debe ser YYYY-MM-DD"
      });
    }

    const invoiceData = {
      invoice_number,
      invoice_date,
      patient_id: parseInt(patient_id),
      session_ids: session_ids.map(id => parseInt(id)),
      concept
    };

    const result = await createInvoice(req.db, invoiceData);

    res.status(201).json({
      success: true,
      message: `Factura ${invoice_number} generada exitosamente`,
      data: result
    });
  } catch (err) {
    console.error("Error al generar factura:", err.message);

    // Manejo de errores específicos
    if (err.message.includes('Duplicate entry') && err.message.includes('invoice_number')) {
      return res.status(409).json({
        success: false,
        error: "El número de factura ya existe. Por favor, use un número diferente."
      });
    }

    res.status(500).json({
      success: false,
      error: err.message || "Error al generar la factura"
    });
  }
};

// Obtener facturas emitidas
const obtenerFacturasEmitidas = async (req, res) => {
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

    const invoicesData = await getIssuedInvoices(req.db, filters);

    res.json({
      success: true,
      data: invoicesData
    });
  } catch (err) {
    console.error("Error al obtener facturas emitidas:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener las facturas emitidas"
    });
  }
};

module.exports = {
  obtenerKPIsFacturacion,
  obtenerFacturasPendientes,
  generarFactura,
  obtenerFacturasEmitidas
};
