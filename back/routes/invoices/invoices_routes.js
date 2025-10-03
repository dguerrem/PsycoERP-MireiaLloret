const express = require("express");
const router = express.Router();

const { obtenerKPIsFacturacion } = require("../../controllers/invoices/invoices_controller");

// GET /api/invoices/kpis - Obtener KPIs de facturación
router.get("/kpis", obtenerKPIsFacturacion);

module.exports = router;
