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
        WHERE is_active = true
    `;
  const params = [];
  const conditions = [];

  if (filters.name) {
    conditions.push("name LIKE ?");
    params.push(`%${filters.name}%`);
  }

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
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
  
  const query = `UPDATE clinics SET ${fields.join(", ")} WHERE id = ? AND is_active = true`;
  
  const [result] = await db.execute(query, params);
  
  if (result.affectedRows === 0) {
    throw new Error("Clinic not found");
  }
  
  return result;
};

// Soft delete de una clínica (actualizar is_active = false)
const deleteClinic = async (id) => {
  const query = `
    UPDATE clinics 
    SET is_active = false
    WHERE id = ? AND is_active = true
  `;
  
  const [result] = await db.execute(query, [id]);
  return result.affectedRows > 0;
};

const createClinic = async (data) => {
  const { name, address, clinic_color } = data;
  
  if (!name) {
    throw new Error("Name is required");
  }
  
  if (!address) {
    throw new Error("Address is required");
  }
  
  if (!clinic_color) {
    throw new Error("Clinic color is required");
  }
  
  const query = `
    INSERT INTO clinics (name, address, clinic_color)
    VALUES (?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [name, address, clinic_color]);
  
  return {
    id: result.insertId,
    ...data,
  };
};

module.exports = {
  getClinics,
  createClinic,
  updateClinic,
  deleteClinic,
};