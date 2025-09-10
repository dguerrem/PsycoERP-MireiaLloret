const { db } = require("../../config/db");

const getClinics = async (filters = {}) => {
  // Extraer parámetros de paginación
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  // Query base para contar registros totales
  let countQuery = `
        SELECT COUNT(*) as total
        FROM clinics
        WHERE is_active = true
    `;

  // Query principal para obtener datos
  let dataQuery = `
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

  // Aplicar filtros
  if (filters.name) {
    conditions.push("name LIKE ?");
    params.push(`%${filters.name}%`);
  }

  // Aplicar condiciones a ambas queries
  if (conditions.length > 0) {
    const conditionsStr = " AND " + conditions.join(" AND ");
    countQuery += conditionsStr;
    dataQuery += conditionsStr;
  }

  // Agregar ordenamiento y paginación solo a la query de datos
  dataQuery += " ORDER BY created_at DESC";
  dataQuery += " LIMIT ? OFFSET ?";
  
  // Ejecutar ambas queries
  const [countResult] = await db.execute(countQuery, params);
  const totalRecords = countResult[0].total;
  
  const [dataRows] = await db.execute(dataQuery, [...params, limit, offset]);
  
  // Calcular información de paginación
  const totalPages = Math.ceil(totalRecords / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    data: dataRows,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalRecords: totalRecords,
      recordsPerPage: limit,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  };
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