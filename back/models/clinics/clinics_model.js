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

const updateClinic = async (id, data) => {
  const { name, address, clinic_color } = data;
  
  const fields = [];
  const params = [];
  
  if (name !== undefined) {
    fields.push("name = ?");
    params.push(name);
  }
  
  if (address !== undefined) {
    fields.push("address = ?");
    params.push(address);
  }
  
  if (clinic_color !== undefined) {
    fields.push("clinic_color = ?");
    params.push(clinic_color);
  }
  
  if (fields.length === 0) {
    throw new Error("No fields to update");
  }
  
  params.push(id);
  
  const query = `UPDATE clinics SET ${fields.join(", ")} WHERE id = ?`;
  
  const [result] = await db.execute(query, params);
  
  if (result.affectedRows === 0) {
    throw new Error("Clinic not found");
  }
  
  return result;
};

module.exports = {
  getClinics,
  updateClinic,
};