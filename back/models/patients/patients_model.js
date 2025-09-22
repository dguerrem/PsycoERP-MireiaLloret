const { db } = require("../../config/db");

// Obtener todos los pacientes con filtros opcionales y paginación
const getPatients = async (filters = {}) => {
  // Extraer parámetros de paginación
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  // Query base para contar registros totales
  let countQuery = `
        SELECT COUNT(*) as total
        FROM patients
        WHERE is_active = true AND status = 'en curso'
    `;

  // Query principal para obtener datos
  let dataQuery = `
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            dni,
            gender,
            occupation,
            status,
            DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date,
            street,
            street_number,
            door,
            postal_code,
            city,
            province,
            clinic_id,
            DATE_FORMAT(treatment_start_date, '%Y-%m-%d') as treatment_start_date,
            is_minor,
            DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
            DATE_FORMAT(updated_at,'%Y-%m-%d') as updated_at
        FROM patients
        WHERE is_active = true AND status = 'en curso'
    `;

  const params = [];
  const conditions = [];

  // Aplicar filtros
  if (filters.first_name) {
    conditions.push("first_name LIKE ?");
    params.push(`%${filters.first_name}%`);
  }

  if (filters.last_name) {
    conditions.push("last_name LIKE ?");
    params.push(`%${filters.last_name}%`);
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

  if (filters.gender) {
    conditions.push("gender = ?");
    params.push(filters.gender);
  }

  if (filters.occupation) {
    conditions.push("occupation LIKE ?");
    params.push(`%${filters.occupation}%`);
  }

  if (filters.clinic_id) {
    conditions.push("clinic_id = ?");
    params.push(filters.clinic_id);
  }

  if (filters.is_minor !== undefined) {
    conditions.push("is_minor = ?");
    params.push(filters.is_minor);
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

// Obtener un paciente por ID con información específica para PatientResume
const getPatientById = async (id) => {
  // Consulta para obtener datos básicos del paciente
  const patientQuery = `
        SELECT
            id,
            email,
            phone
        FROM patients
        WHERE id = ? AND is_active = true
    `;
  
  const [patientRows] = await db.execute(patientQuery, [id]);
  
  if (patientRows.length === 0) {
    return {
      PatientResume: null
    };
  }

  // Consulta para obtener sesiones del paciente
  const sessionsQuery = `
        SELECT 
            id as idsesion,
            DATE_FORMAT(session_date, '%Y-%m-%d') as fecha,
            price as precio,
            payment_method as metodo_pago
        FROM sessions
        WHERE patient_id = ?
        ORDER BY session_date DESC
    `;
  
  const [sessionsRows] = await db.execute(sessionsQuery, [id]);
  
  // Consulta para obtener datos detallados del paciente
  const patientDataQuery = `
        SELECT
            CONCAT(first_name, ' ', last_name) as nombre,
            dni,
            DATE_FORMAT(birth_date, '%Y-%m-%d') as fecha_nacimiento,
            status as estado,
            email,
            phone as telefono,
            CONCAT_WS(' ', street, street_number, door, city, province, postal_code) as direccion,
            gender as genero,
            occupation as ocupacion,
            clinic_id,
            DATE_FORMAT(treatment_start_date, '%Y-%m-%d') as fecha_inicio_tratamiento,
            is_minor as menor_edad
        FROM patients
        WHERE id = ? AND is_active = true
    `;
  
  const [patientDataRows] = await db.execute(patientDataQuery, [id]);
  
  // Consulta para obtener sesiones extendidas para PatientSessions
  const patientSessionsQuery = `
        SELECT 
            s.id,
            DATE_FORMAT(s.session_date, '%Y-%m-%d') as fecha,
            c.name as clinica,
            s.status as estado,
            s.price as precio,
            s.payment_method as tipo_pago,
            s.notes as notas
        FROM sessions s
        LEFT JOIN clinics c ON s.clinic_id = c.id
        WHERE s.patient_id = ?
        ORDER BY s.session_date DESC
    `;
  
  const [patientSessionsRows] = await db.execute(patientSessionsQuery, [id]);
  

  // Consulta para obtener notas clínicas del paciente
  const clinicalNotesQuery = `
        SELECT 
            title as titulo,
            content as contenido,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as fecha
        FROM clinical_notes
        WHERE patient_id = ?
        ORDER BY created_at DESC
    `;
  
  const [clinicalNotesRows] = await db.execute(clinicalNotesQuery, [id]);

  const patientResumeData = patientRows[0];
  patientResumeData.PatientResumeSessions = sessionsRows;
  
  return {
    PatientResume: patientResumeData,
    PatientData: patientDataRows[0] || {},
    PatientMedicalRecord: clinicalNotesRows,
    PatientSessions: patientSessionsRows
  };
};

// Obtener pacientes inactivos (status != 'en curso') con filtros opcionales y paginación
const getInactivePatients = async (filters = {}) => {
  // Extraer parámetros de paginación
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  // Query base para contar registros totales
  let countQuery = `
        SELECT COUNT(*) as total
        FROM patients
        WHERE is_active = true AND status != 'en curso'
    `;

  // Query principal para obtener datos
  let dataQuery = `
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            dni,
            gender,
            occupation,
            status,
            DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date,
            street,
            street_number,
            door,
            postal_code,
            city,
            province,
            clinic_id,
            DATE_FORMAT(treatment_start_date, '%Y-%m-%d') as treatment_start_date,
            is_minor,
            DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
            DATE_FORMAT(updated_at,'%Y-%m-%d') as updated_at
        FROM patients
        WHERE is_active = true AND status != 'en curso'
    `;

  const params = [];
  const conditions = [];

  // Aplicar filtros
  if (filters.first_name) {
    conditions.push("first_name LIKE ?");
    params.push(`%${filters.first_name}%`);
  }

  if (filters.last_name) {
    conditions.push("last_name LIKE ?");
    params.push(`%${filters.last_name}%`);
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

  if (filters.gender) {
    conditions.push("gender = ?");
    params.push(filters.gender);
  }

  if (filters.occupation) {
    conditions.push("occupation LIKE ?");
    params.push(`%${filters.occupation}%`);
  }

  if (filters.clinic_id) {
    conditions.push("clinic_id = ?");
    params.push(filters.clinic_id);
  }

  if (filters.is_minor !== undefined) {
    conditions.push("is_minor = ?");
    params.push(filters.is_minor);
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

// Soft delete de un paciente (actualizar is_active = false)
const deletePatient = async (id) => {
  const query = `
    UPDATE patients 
    SET is_active = false, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ? AND is_active = true
  `;
  
  const [result] = await db.execute(query, [id]);
  return result.affectedRows > 0;
};

// Crear un nuevo paciente
const createPatient = async (patientData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    dni,
    gender,
    occupation,
    birth_date,
    street,
    street_number,
    door,
    postal_code,
    city,
    province,
    clinic_id,
    treatment_start_date,
    status,
    is_minor,
  } = patientData;

  const query = `
    INSERT INTO patients (
      first_name,
      last_name,
      email,
      phone,
      dni,
      gender,
      occupation,
      birth_date,
      street,
      street_number,
      door,
      postal_code,
      city,
      province,
      clinic_id,
      treatment_start_date,
      status,
      is_minor,
      is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)
  `;

  const params = [
    first_name,
    last_name,
    email,
    phone,
    dni,
    gender,
    occupation,
    birth_date,
    street,
    street_number,
    door,
    postal_code,
    city,
    province,
    clinic_id,
    treatment_start_date,
    status,
    is_minor,
  ];

  const [result] = await db.execute(query, params);

  // Obtener el paciente recién creado
  const getPatientQuery = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      dni,
      gender,
      occupation,
      DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date,
      street,
      street_number,
      door,
      postal_code,
      city,
      province,
      clinic_id,
      DATE_FORMAT(treatment_start_date, '%Y-%m-%d') as treatment_start_date,
      status,
      is_minor,
      DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
      DATE_FORMAT(updated_at,'%Y-%m-%d') as updated_at
    FROM patients
    WHERE id = ? AND is_active = true
  `;

  const [patientRows] = await db.execute(getPatientQuery, [result.insertId]);
  return patientRows[0];
};

// Restaurar un paciente (activar cambiando status a "en curso")
const restorePatient = async (id) => {
  // Primero verificar si el paciente existe y su status actual
  const checkQuery = `
    SELECT id, status, is_active
    FROM patients
    WHERE id = ? AND is_active = true
  `;

  const [patientRows] = await db.execute(checkQuery, [id]);

  if (patientRows.length === 0) {
    throw new Error("Patient not found");
  }

  const patient = patientRows[0];

  // Verificar si el paciente ya está activo (status "en curso")
  if (patient.status === "en curso") {
    throw new Error("Patient already active");
  }

  // Actualizar el status a "en curso" para reactivar al paciente
  const updateQuery = `
    UPDATE patients
    SET status = 'en curso', updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND is_active = true
  `;

  const [result] = await db.execute(updateQuery, [id]);
  return result.affectedRows > 0;
};

// Actualizar un paciente existente
const updatePatient = async (id, updateData) => {
  // Verificar que hay campos para actualizar
  if (Object.keys(updateData).length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  // Construir la query dinámicamente
  const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updateData);

  const query = `
    UPDATE patients
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND is_active = true
  `;

  values.push(id);

  const [result] = await db.execute(query, values);

  if (result.affectedRows === 0) {
    return null;
  }

  // Obtener el paciente actualizado
  const getPatientQuery = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      dni,
      gender,
      occupation,
      DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date,
      street,
      street_number,
      door,
      postal_code,
      city,
      province,
      clinic_id,
      DATE_FORMAT(treatment_start_date, '%Y-%m-%d') as treatment_start_date,
      status,
      is_minor,
      DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
      DATE_FORMAT(updated_at,'%Y-%m-%d') as updated_at
    FROM patients
    WHERE id = ? AND is_active = true
  `;

  const [patientRows] = await db.execute(getPatientQuery, [id]);
  return patientRows[0];
};

// Obtener pacientes activos con información de clínica
const getActivePatientsWithClinicInfo = async () => {
  const query = `
    SELECT
      p.id as idPaciente,
      CONCAT(p.first_name, ' ', p.last_name) as nombreCompleto,
      p.clinic_id as idClinica,
      c.name as nombreClinica,
      c.price as precioSesion,
      c.percentage as porcentaje
    FROM patients p
    LEFT JOIN clinics c ON p.clinic_id = c.id
    WHERE p.is_active = 1 AND p.status = 'en curso' AND c.is_active = 1
    ORDER BY CONCAT(p.first_name, ' ', p.last_name)
  `;

  const [rows] = await db.execute(query);
  return rows;
};

module.exports = {
  getPatients,
  getPatientById,
  getInactivePatients,
  deletePatient,
  createPatient,
  restorePatient,
  updatePatient,
  getActivePatientsWithClinicInfo,
};