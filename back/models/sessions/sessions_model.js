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
        LEFT JOIN patients p ON s.patient_id = p.id AND p.is_active = true AND p.status = 'en curso'
        LEFT JOIN clinics c ON s.clinic_id = c.id AND c.is_active = true
        WHERE s.is_active = true
    `;

  // Query principal para obtener datos
  let dataQuery = `
        SELECT
            s.id AS session_id,
            s.session_date,
            s.start_time,
            s.end_time,
            s.mode,
            s.status,
            s.price,
            s.payment_method,
            s.notes,
            p.id AS patient_id,
            CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
            c.id AS clinic_id,
            c.name AS clinic_name
        FROM sessions s
        LEFT JOIN patients p ON s.patient_id = p.id AND p.is_active = true AND p.status = 'en curso'
        LEFT JOIN clinics c ON s.clinic_id = c.id AND c.is_active = true
        WHERE s.is_active = true
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

  // Aplicar condiciones adicionales a ambas queries
  if (conditions.length > 0) {
    const conditionsStr = " AND " + conditions.join(" AND ");
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
  const transformedData = await Promise.all(
    rows.map(async (row) => {
      // Obtener notas clínicas del paciente (solo si el paciente está activo)
      const [medicalRecords] = await db.execute(
        `
      SELECT cn.title, cn.content, cn.created_at 
      FROM clinical_notes cn
      INNER JOIN patients p ON cn.patient_id = p.id
      WHERE cn.patient_id = ? AND p.is_active = true
      ORDER BY cn.created_at DESC
    `,
        [row.patient_id]
      );

      return {
        SessionDetailData: {
          session_id: row.session_id,
          session_date: row.session_date,
          start_time: row.start_time,
          end_time: row.end_time,
          mode: row.mode,
          status: row.status,
          price: row.price,
          payment_method: row.payment_method,
          notes: row.notes,
          PatientData: {
            id: row.patient_id,
            name: row.patient_name,
          },
          ClinicDetailData: {
            clinic_id: row.clinic_id,
            clinic_name: row.clinic_name,
          },
          MedicalRecordData: medicalRecords.map((record) => ({
            title: record.title,
            content: record.content,
            date: record.created_at,
          })),
        },
      };
    })
  );

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
      prevPage: hasPrevPage ? page - 1 : null,
    },
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
    status,
    price,
    payment_method,
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
      status,
      price,
      payment_method,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
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
    WHERE id = ? AND is_active = true
  `;

  // Crear array de parámetros: valores + ID al final
  const params = [...Object.values(updateData), sessionId];

  await db.execute(query, params);

  // Retornar la sesión actualizada
  const [updatedSession] = await db.execute(
    "SELECT * FROM sessions WHERE id = ? AND is_active = true",
    [sessionId]
  );

  return updatedSession[0];
};

// Eliminar sesión (soft delete)
const deleteSession = async (sessionId) => {
  // Realizar soft delete marcando is_active = false
  const [result] = await db.execute(
    "UPDATE sessions SET is_active = false WHERE id = ? AND is_active = true",
    [sessionId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Sesión no encontrada o ya está eliminada");
  }

  return true;
};

// Obtener datos de sesión con paciente para WhatsApp
const getSessionForWhatsApp = async (sessionId) => {
  const query = `
    SELECT
      s.id,
      s.session_date,
      s.start_time,
      s.status,
      CONCAT(p.first_name, ' ', p.last_name) as patient_name,
      p.phone as patient_phone
    FROM sessions s
    INNER JOIN patients p ON s.patient_id = p.id AND p.is_active = true AND p.status = 'en curso'
    WHERE s.id = ? AND s.is_active = true
  `;

  const [rows] = await db.execute(query, [sessionId]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

module.exports = {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getSessionForWhatsApp,
};
