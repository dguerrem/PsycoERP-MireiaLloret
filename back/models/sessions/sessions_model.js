const { db } = require("../../config/db");

// Obtener todas las sesiones con filtros opcionales
const getSessions = async (filters = {}) => {
  debugger;
  let query = `
        SELECT 
            id,
            patient_id,
            clinic_id,
            session_date,
            start_time,
            end_time,
            mode,
            type,
            status,
            price,
            payment_method,
            payment_status,
            notes,
            created_at,
            updated_at
        FROM sessions
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

  if (filters.clinic_id) {
    conditions.push("clinic_id = ?");
    params.push(filters.clinic_id);
  }

  if (filters.session_date) {
    conditions.push("session_date = ?");
    params.push(filters.session_date);
  }

  if (filters.payment_status) {
    conditions.push("payment_status = ?");
    params.push(filters.payment_status);
  }

  if (filters.payment_method) {
    conditions.push("payment_method = ?");
    params.push(filters.payment_method);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY session_date DESC, start_time DESC";

  const [rows] = await db.execute(query, params);
  return rows;
};

module.exports = {
  getSessions,
};
