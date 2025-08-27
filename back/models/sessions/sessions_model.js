const { db } = require("../../config/db");

// Obtener todas las sesiones con filtros opcionales
const getSessions = async (filters = {}) => {
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

  // Lógica inteligente de fechas
  if (filters.session_date) {
    // Fecha específica
    conditions.push("session_date = ?");
    params.push(filters.session_date);
  } else {
    // Rango de fechas
    if (filters.fecha_desde) {
      conditions.push("session_date >= ?");
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      conditions.push("session_date <= ?");
      params.push(filters.fecha_hasta);
    }
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY session_date DESC, start_time DESC";

  const [rows] = await db.execute(query, params);
  return rows;
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

module.exports = {
  getSessions,
  createSession,
  updateSession,
};
