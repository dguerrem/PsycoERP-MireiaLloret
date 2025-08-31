const { db } = require("../../config/db");

// Obtener KPIs reales del dashboard
const getDashboardKPIs = async () => {
  try {
    // Fechas para las consultas
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Mes anterior
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    // Fecha de hoy para citas
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    // 1. Sesiones del mes actual
    const sessionesEsteMesQuery = `
      SELECT COUNT(*) as count, COALESCE(SUM(price), 0) as ingresos
      FROM sessions
      WHERE YEAR(session_date) = ? AND MONTH(session_date) = ?
      AND status IN ('completed', 'scheduled')
    `;
    const [sessionesEsteMes] = await db.execute(sessionesEsteMesQuery, [currentYear, currentMonth]);

    // 2. Sesiones del mes anterior
    const sessionesMesAnteriorQuery = `
      SELECT COUNT(*) as count, COALESCE(SUM(price), 0) as ingresos
      FROM sessions
      WHERE YEAR(session_date) = ? AND MONTH(session_date) = ?
      AND status IN ('completed', 'scheduled')
    `;
    const [sessionesMesAnterior] = await db.execute(sessionesMesAnteriorQuery, [previousYear, previousMonth]);

    // 3. Pacientes activos
    const pacientesActivosQuery = `
      SELECT COUNT(*) as count
      FROM patients
      WHERE status = 'active'
    `;
    const [pacientesActivos] = await db.execute(pacientesActivosQuery);

    // 4. Pacientes nuevos este mes
    const pacientesNuevosMesQuery = `
      SELECT COUNT(*) as count
      FROM patients
      WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?
    `;
    const [pacientesNuevosMes] = await db.execute(pacientesNuevosMesQuery, [currentYear, currentMonth]);

    // 5. Próximas citas hoy
    const proximasCitasHoyQuery = `
      SELECT COUNT(*) as count
      FROM sessions
      WHERE session_date = ? AND status = 'scheduled'
    `;
    const [proximasCitasHoy] = await db.execute(proximasCitasHoyQuery, [today]);

    // 6. Siguiente cita de hoy
    const siguienteCitaQuery = `
      SELECT start_time
      FROM sessions
      WHERE session_date = ? AND status = 'scheduled' AND start_time > ?
      ORDER BY start_time ASC
      LIMIT 1
    `;
    const [siguienteCita] = await db.execute(siguienteCitaQuery, [today, currentTime]);

    // Calcular variaciones porcentuales
    const sesionesActual = sessionesEsteMes[0].count;
    const sesionesAnterior = sessionesMesAnterior[0].count;
    const sesionesVariacion = sesionesAnterior > 0 
      ? ((sesionesActual - sesionesAnterior) / sesionesAnterior) * 100 
      : (sesionesActual > 0 ? 100 : 0);

    const ingresosActual = parseFloat(sessionesEsteMes[0].ingresos);
    const ingresosAnterior = parseFloat(sessionesMesAnterior[0].ingresos);
    const ingresosVariacion = ingresosAnterior > 0 
      ? ((ingresosActual - ingresosAnterior) / ingresosAnterior) * 100 
      : (ingresosActual > 0 ? 100 : 0);

    // Construir respuesta
    const rapidKPIData = {
      sesiones_mes: sesionesActual,
      sesiones_variacion: Math.round(sesionesVariacion * 100) / 100, // Redondear a 2 decimales
      ingresos_mes: ingresosActual,
      ingresos_variacion: Math.round(ingresosVariacion * 100) / 100,
      pacientes_activos: pacientesActivos[0].count,
      pacientes_nuevos_mes: pacientesNuevosMes[0].count,
      proximas_citas_hoy: proximasCitasHoy[0].count,
      siguiente_cita_hora: siguienteCita.length > 0 ? siguienteCita[0].start_time : null
    };

    return rapidKPIData;

  } catch (error) {
    console.error('Error al obtener KPIs del dashboard:', error);
    throw error;
  }
};

module.exports = {
  getDashboardKPIs,
};