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

module.exports = {
  getBonuses,
};