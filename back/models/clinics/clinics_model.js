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
            price,
            percentage,
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
  dataQuery += " ORDER BY name ASC";
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
  const { name, clinic_color, address, price, percentage } = data;

  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push("name = ?");
    params.push(name);
  }

  if (clinic_color !== undefined) {
    fields.push("clinic_color = ?");
    params.push(clinic_color);
  }

  if (address !== undefined) {
    fields.push("address = ?");
    params.push(address);
  }

  if (price !== undefined) {
    fields.push("price = ?");
    params.push(price);
  }

  if (percentage !== undefined) {
    fields.push("percentage = ?");
    params.push(percentage);
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

// Obtener clínicas eliminadas (soft deleted) con filtros opcionales y paginación
const getDeletedClinics = async (filters = {}) => {
  // Extraer parámetros de paginación
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  // Query base para contar registros totales
  let countQuery = `
        SELECT COUNT(*) as total
        FROM clinics
        WHERE is_active = false
    `;

  // Query principal para obtener datos
  let dataQuery = `
        SELECT
            id,
            name,
            address,
            clinic_color,
            price,
            percentage,
            DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
            DATE_FORMAT(updated_at,'%Y-%m-%d') as updated_at
        FROM clinics
        WHERE is_active = false
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
  dataQuery += " ORDER BY updated_at DESC";
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

const createClinic = async (data) => {
  const { name, clinic_color, address, price, percentage } = data;

  if (!name) {
    throw new Error("Name is required");
  }

  if (!clinic_color) {
    throw new Error("Clinic color is required");
  }

  const fields = ["name", "clinic_color"];
  const values = [name, clinic_color];
  const placeholders = ["?", "?"];

  if (address !== undefined) {
    fields.push("address");
    values.push(address);
    placeholders.push("?");
  }

  if (price !== undefined) {
    fields.push("price");
    values.push(price);
    placeholders.push("?");
  }

  if (percentage !== undefined) {
    fields.push("percentage");
    values.push(percentage);
    placeholders.push("?");
  }

  const query = `
    INSERT INTO clinics (${fields.join(", ")})
    VALUES (${placeholders.join(", ")})
  `;

  const [result] = await db.execute(query, values);

  return {
    id: result.insertId,
    ...data,
  };
};

module.exports = {
  getClinics,
  getDeletedClinics,
  createClinic,
  updateClinic,
  deleteClinic,
};