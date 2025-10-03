const express = require("express");
const router = express.Router();

const { obtenerKPIsFacturacion, obtenerFacturasPendientes } = require("../../controllers/invoices/invoices_controller");

// GET /api/invoices/kpis - Obtener KPIs de facturación
router.get("/kpis", obtenerKPIsFacturacion);

// GET /api/invoices/pending - Obtener sesiones pendientes de facturar
router.get("/pending", obtenerFacturasPendientes);

module.exports = router;
