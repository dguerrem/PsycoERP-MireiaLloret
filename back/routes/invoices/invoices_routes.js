const express = require("express");
const router = express.Router();

const { obtenerKPIsFacturacion, obtenerFacturasPendientes, generarFactura, obtenerFacturasEmitidas } = require("../../controllers/invoices/invoices_controller");

// GET /api/invoices/kpis - Obtener KPIs de facturación
router.get("/kpis", obtenerKPIsFacturacion);

// GET /api/invoices/pending - Obtener sesiones pendientes de facturar
router.get("/pending", obtenerFacturasPendientes);

// GET /api/invoices - Obtener facturas emitidas
router.get("/", obtenerFacturasEmitidas);

// POST /api/invoices - Generar factura
router.post("/", generarFactura);

module.exports = router;
