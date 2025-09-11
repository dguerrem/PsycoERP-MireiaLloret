const { db } = require("../../config/db");

const getPendingReminders = async () => {
  // Calcular la fecha objetivo según la lógica especial de días
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  
  let targetDate;
  
  if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Lunes a Jueves
    // Mostrar sesiones del día siguiente
    targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 1);
  } else { // Viernes (5), Sábado (6), Domingo (0)
    // Mostrar sesiones del lunes siguiente
    const daysUntilMonday = (8 - dayOfWeek) % 7;
    targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (daysUntilMonday === 0 ? 7 : daysUntilMonday));
  }
  
  // Formatear fecha para MySQL (YYYY-MM-DD)
  const formattedDate = targetDate.toISOString().split('T')[0];
  
  const query = `
    SELECT 
      s.id as session_id,
      s.start_time,
      s.end_time,
      p.name as patient_name,
      IF(r.id IS NOT NULL, true, false) as reminder_sent
    FROM sessions s
    INNER JOIN patients p ON s.patient_id = p.id
    LEFT JOIN reminders r ON s.id = r.session_id
    WHERE s.session_date = ?
      AND s.status = 'programada'
      AND s.is_active = true
      AND p.is_active = true
    ORDER BY s.start_time ASC
  `;
  
  const [rows] = await db.execute(query, [formattedDate]);
  
  return {
    targetDate: formattedDate,
    total: rows.length,
    sessions: rows
  };
};

const createReminder = async (sessionId) => {
  // Verificar que no existe ya un reminder para esta sesión
  const checkReminderQuery = `
    SELECT id 
    FROM reminders 
    WHERE session_id = ?
  `;
  
  const [reminderResult] = await db.execute(checkReminderQuery, [sessionId]);
  
  if (reminderResult.length > 0) {
    throw new Error("La sesión ya tiene un recordatorio enviado.");
  }
  
  // Insertar el nuevo reminder
  const insertQuery = `
    INSERT INTO reminders (session_id)
    VALUES (?)
  `;
  
  const [result] = await db.execute(insertQuery, [sessionId]);
  
  return {
    id: result.insertId,
    session_id: sessionId,
    created_at: new Date()
  };
};

module.exports = {
  getPendingReminders,
  createReminder,
};