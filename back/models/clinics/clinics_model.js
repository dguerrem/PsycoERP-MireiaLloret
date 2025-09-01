const { db } = require("../../config/db");

const getClinics = async (filters = {}) => {
  let query = `
        SELECT 
            id,
            name,
            address,
            clinic_color,
            DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
            DATE_FORMAT(updated_at,'%Y-%m-%d') as updated_at
        FROM clinics
    `;
  const params = [];
  const conditions = [];

  if (filters.name) {
    conditions.push("name LIKE ?");
    params.push(`%${filters.name}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";

  const [rows] = await db.execute(query, params);
  return rows;
};

module.exports = {
  getClinics,
};