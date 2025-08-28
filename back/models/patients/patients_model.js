const { db } = require("../../config/db");

// Obtener todos los pacientes con filtros opcionales
const getPatients = async (filters = {}) => {
  let query = `
        SELECT 
            id,
            name,
            email,
            phone,
            dni,
            status,
            session_type,
            address,
            DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date,
            emergency_contact_name,
            emergency_contact_phone,
            medical_history,
            current_medication,
            allergies,
            referred_by,
            insurance_provider,
            insurance_number,
            notes,
            created_at,
            updated_at
        FROM patients
    `;
  const params = [];
  const conditions = [];

  if (filters.name) {
    conditions.push("name LIKE ?");
    params.push(`%${filters.name}%`);
  }

  if (filters.email) {
    conditions.push("email LIKE ?");
    params.push(`%${filters.email}%`);
  }

  if (filters.dni) {
    conditions.push("dni = ?");
    params.push(filters.dni);
  }

  if (filters.status) {
    conditions.push("status = ?");
    params.push(filters.status);
  }

  if (filters.session_type) {
    conditions.push("session_type = ?");
    params.push(filters.session_type);
  }

  if (filters.insurance_provider) {
    conditions.push("insurance_provider LIKE ?");
    params.push(`%${filters.insurance_provider}%`);
  }

  if (filters.referred_by) {
    conditions.push("referred_by LIKE ?");
    params.push(`%${filters.referred_by}%`);
  }

  if (filters.birth_date) {
    conditions.push("birth_date = ?");
    params.push(filters.birth_date);
  }

  // Lógica inteligente de fechas para created_at
  if (filters.fecha_desde) {
    conditions.push("created_at >= ?");
    params.push(filters.fecha_desde);
  }

  if (filters.fecha_hasta) {
    conditions.push("created_at <= ?");
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
  getPatients,
};