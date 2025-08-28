const { db } = require("../../config/db");

// Obtener todos los bonuses con filtros opcionales
const getBonuses = async (filters = {}) => {
  let query = `
        SELECT 
            id,
            patient_id,
            total_sessions,
            price_per_session,
            total_price,
            used_sessions,
            status,
            DATE_FORMAT(purchase_date, '%Y-%m-%d') as purchase_date,
            DATE_FORMAT(expiry_date, '%Y-%m-%d') as expiry_date,
            notes,
            DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
            updated_at
        FROM bonuses
    `;
  const params = [];
  const conditions = [];

  if (filters.patient_id) {
    conditions.push("patient_id = ?");
    params.push(filters.patient_id);
  }

  if (filters.status) {
    conditions.push("status = ?");
    params.push(filters.status);
  }

  if (filters.fecha_desde) {
    conditions.push("purchase_date >= ?");
    params.push(filters.fecha_desde);
  }

  if (filters.fecha_hasta) {
    conditions.push("purchase_date <= ?");
    params.push(filters.fecha_hasta);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";

  const [rows] = await db.execute(query, params);
  return rows;
};

// Obtener bonuses por patient_id con KPIs y detalles
const getBonusesByPatientId = async (patientId) => {
  // Consulta para obtener KPIs
  const kpisQuery = `
        SELECT 
            COUNT(*) as total_bonos,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as total_activos,
            SUM(CASE WHEN status = 'consumed' THEN 1 ELSE 0 END) as total_consumidos,
            SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as total_expirados
        FROM bonuses
        WHERE patient_id = ?
    `;
  
  const [kpisRows] = await db.execute(kpisQuery, [patientId]);
  const kpis = kpisRows[0];

  // Consulta para obtener detalles de cada bono
  const bonusesQuery = `
        SELECT 
            id as idBono,
            total_sessions as sesiones_totales,
            price_per_session as euros_por_sesion,
            total_price as precio_total,
            DATE_FORMAT(purchase_date, '%Y-%m-%d') as fecha_compra,
            DATE_FORMAT(expiry_date, '%Y-%m-%d') as fecha_expiracion,
            (total_sessions - used_sessions) as sesiones_restantes,
            used_sessions as sesiones_utilizadas,
            status as estado_bono
        FROM bonuses
        WHERE patient_id = ?
        ORDER BY purchase_date DESC
    `;
  
  const [bonusesRows] = await db.execute(bonusesQuery, [patientId]);

  return {
    kpis: {
      total_bonos: parseInt(kpis.total_bonos) || 0,
      total_activos: parseInt(kpis.total_activos) || 0,
      total_consumidos: parseInt(kpis.total_consumidos) || 0,
      total_expirados: parseInt(kpis.total_expirados) || 0
    },
    bonuses: bonusesRows
  };
};

module.exports = {
  getBonuses,
  getBonusesByPatientId,
};