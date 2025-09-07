const { db } = require("../../config/db");

// Obtener todas las sesiones con filtros opcionales y paginación
const getSessions = async (filters = {}) => {
  // Extraer parámetros de paginación
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  // Query base para contar registros totales
  let countQuery = `
        SELECT COUNT(*) as total
        FROM sessions s
        LEFT JOIN patients p ON s.patient_id = p.id
        LEFT JOIN clinics c ON s.clinic_id = c.id
    `;

  // Query principal para obtener datos
  let dataQuery = `
        SELECT 
            s.id AS session_id,
            s.session_date,
            s.start_time,
            s.end_time,
            s.type,
            s.price,
            s.payment_method,
            s.status,
            s.notes,
            p.id AS patient_id,
            p.name AS patient_name,
            c.id AS clinic_id,
            c.name AS clinic_name
        FROM sessions s
        LEFT JOIN patients p ON s.patient_id = p.id
        LEFT JOIN clinics c ON s.clinic_id = c.id
    `;
  const params = [];
  const conditions = [];

  if (filters.patient_id) {
    conditions.push("s.patient_id = ?");
    params.push(filters.patient_id);
  }

  if (filters.status) {
    conditions.push("s.status = ?");
    params.push(filters.status);
  }

  if (filters.clinic_id) {
    conditions.push("s.clinic_id = ?");
    params.push(filters.clinic_id);
  }

  if (filters.session_date) {
    conditions.push("s.session_date = ?");
    params.push(filters.session_date);
  }

  if (filters.payment_status) {
    conditions.push("s.payment_status = ?");
    params.push(filters.payment_status);
  }

  if (filters.payment_method) {
    conditions.push("s.payment_method = ?");
    params.push(filters.payment_method);
  }

  // Lógica inteligente de fechas
  if (filters.session_date) {
    // Fecha específica
    conditions.push("s.session_date = ?");
    params.push(filters.session_date);
  } else {
    // Rango de fechas
    if (filters.fecha_desde) {
      conditions.push("s.session_date >= ?");
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push("s.session_date <= ?");
      params.push(filters.fecha_hasta);
    }
  }

  // Aplicar condiciones a ambas queries
  if (conditions.length > 0) {
    const conditionsStr = " WHERE " + conditions.join(" AND ");
    countQuery += conditionsStr;
    dataQuery += conditionsStr;
  }

  // Agregar ordenamiento y paginación solo a la query de datos
  dataQuery += " ORDER BY s.session_date DESC, s.start_time DESC";
  dataQuery += " LIMIT ? OFFSET ?";
  
  // Ejecutar ambas queries
  const [countResult] = await db.execute(countQuery, params);
  const totalRecords = countResult[0].total;
  
  const [rows] = await db.execute(dataQuery, [...params, limit, offset]);
  
  // Transformar datos a estructura organizada
  const transformedData = await Promise.all(rows.map(async (row) => {
    // Obtener notas clínicas del paciente
    const [medicalRecords] = await db.execute(`
      SELECT title, content, date 
      FROM clinical_notes 
      WHERE patient_id = ? 
      ORDER BY date DESC
    `, [row.patient_id]);

    return {
      SessionDetailData: {
        session_id: row.session_id,
        session_date: row.session_date,
        start_time: row.start_time,
        end_time: row.end_time,
        type: row.type,
        price: row.price,
        payment_method: row.payment_method,
        completed: row.status === 'completed',
        notes: row.notes,
        PatientData: {
          id: row.patient_id,
          name: row.patient_name
        },
        ClinicDetailData: {
          clinic_id: row.clinic_id,
          clinic_name: row.clinic_name
        },
        MedicalRecordData: medicalRecords.map(record => ({
          title: record.title,
          content: record.content,
          date: record.date
        }))
      }
    };
  }));

  // Calcular información de paginación
  const totalPages = Math.ceil(totalRecords / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    data: transformedData,
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

// Crear nueva sesión
const createSession = async (sessionData) => {
  const {
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
  } = sessionData;

  const query = `
    INSERT INTO sessions (
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
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
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
  ];

  const [result] = await db.execute(query, params);

  // Retornar la sesión creada con su ID
  const [newSession] = await db.execute("SELECT * FROM sessions WHERE id = ?", [
    result.insertId,
  ]);

  return newSession[0];
};

// Actualizar sesión existente
const updateSession = async (sessionId, updateData) => {
  // Construir query dinámicamente basado en los campos recibidos
  const fields = Object.keys(updateData);

  // Crear la parte SET de la query
  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  const query = `
    UPDATE sessions 
    SET ${setClause}
    WHERE id = ?
  `;

  // Crear array de parámetros: valores + ID al final
  const params = [...Object.values(updateData), sessionId];
  
  await db.execute(query, params);

  // Retornar la sesión actualizada
  const [updatedSession] = await db.execute(
    "SELECT * FROM sessions WHERE id = ?",
    [sessionId]
  );

  return updatedSession[0];
};

// Eliminar sesión
const deleteSession = async (sessionId) => {
  // Primero obtener la sesión antes de eliminarla
  const [sessionToDelete] = await db.execute(
    "SELECT * FROM sessions WHERE id = ?",
    [sessionId]
  );

  if (sessionToDelete.length === 0) {
    throw new Error("Sesión no encontrada");
  }

  // Eliminar la sesión
  await db.execute("DELETE FROM sessions WHERE id = ?", [sessionId]);
};

module.exports = {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
};
