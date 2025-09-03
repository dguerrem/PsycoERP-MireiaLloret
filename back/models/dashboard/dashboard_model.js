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

    // ===== 1. RAPID KPI DATA =====
    
    // Sesiones del mes actual
    const sessionesEsteMesQuery = `
      SELECT COUNT(*) as count, COALESCE(SUM(price), 0) as ingresos
      FROM sessions
      WHERE YEAR(session_date) = ? AND MONTH(session_date) = ?
      AND status IN ('completed', 'scheduled')
    `;
    const [sessionesEsteMes] = await db.execute(sessionesEsteMesQuery, [currentYear, currentMonth]);

    // Sesiones del mes anterior
    const sessionesMesAnteriorQuery = `
      SELECT COUNT(*) as count, COALESCE(SUM(price), 0) as ingresos
      FROM sessions
      WHERE YEAR(session_date) = ? AND MONTH(session_date) = ?
      AND status IN ('completed', 'scheduled')
    `;
    const [sessionesMesAnterior] = await db.execute(sessionesMesAnteriorQuery, [previousYear, previousMonth]);

    // Pacientes activos
    const pacientesActivosQuery = `
      SELECT COUNT(*) as count
      FROM patients
      WHERE status = 'active'
    `;
    const [pacientesActivos] = await db.execute(pacientesActivosQuery);

    // Pacientes nuevos este mes
    const pacientesNuevosMesQuery = `
      SELECT COUNT(*) as count
      FROM patients
      WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?
    `;
    const [pacientesNuevosMes] = await db.execute(pacientesNuevosMesQuery, [currentYear, currentMonth]);

    // Próximas citas hoy
    const proximasCitasHoyQuery = `
      SELECT COUNT(*) as count
      FROM sessions
      WHERE session_date = ? AND status = 'scheduled'
    `;
    const [proximasCitasHoy] = await db.execute(proximasCitasHoyQuery, [today]);

    // Siguiente cita de hoy
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

    const rapidKPIData = {
      sesiones_mes: sesionesActual,
      sesiones_variacion: Math.round(sesionesVariacion * 100) / 100,
      ingresos_mes: ingresosActual,
      ingresos_variacion: Math.round(ingresosVariacion * 100) / 100,
      pacientes_activos: pacientesActivos[0].count,
      pacientes_nuevos_mes: pacientesNuevosMes[0].count,
      proximas_citas_hoy: proximasCitasHoy[0].count,
      siguiente_cita_hora: siguienteCita.length > 0 ? siguienteCita[0].start_time : null
    };

    // ===== 2. SESSIONS BY CLINIC DATA =====
    
    const sessionsByClinicQuery = `
      SELECT 
        c.id as clinic_id,
        c.name as clinic_name,
        COUNT(s.id) as total_sessions,
        GROUP_CONCAT(
          CONCAT(s.id, ':', DATE_FORMAT(s.session_date, '%Y-%m-%d'))
          SEPARATOR '|'
        ) as sessions_details
      FROM clinics c
      LEFT JOIN sessions s ON c.id = s.clinic_id 
        AND s.status IN ('completed', 'scheduled')
      GROUP BY c.id, c.name
      ORDER BY total_sessions DESC
    `;
    const [sessionsByClinic] = await db.execute(sessionsByClinicQuery);

    // Procesar datos de sesiones por clínica
    const sessionsByClinicData = sessionsByClinic.map(clinic => {
      const sessions = [];
      if (clinic.sessions_details) {
        const sessionsList = clinic.sessions_details.split('|');
        sessionsList.forEach(sessionStr => {
          const [sessionId, sessionDate] = sessionStr.split(':');
          sessions.push({
            session_id: parseInt(sessionId),
            session_date: sessionDate
          });
        });
      }

      return {
        clinic_id: clinic.clinic_id,
        clinic_name: clinic.clinic_name,
        total_sessions: clinic.total_sessions,
        sessions: sessions
      };
    });

    // ===== 3. MONTHLY REVENUE DATA =====
    
    // Obtener los últimos 12 meses
    const monthlyRevenueQuery = `
      SELECT 
        YEAR(session_date) as year,
        MONTH(session_date) as month,
        COALESCE(SUM(price), 0) as revenue
      FROM sessions
      WHERE session_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        AND status IN ('completed', 'scheduled')
      GROUP BY YEAR(session_date), MONTH(session_date)
      ORDER BY YEAR(session_date), MONTH(session_date)
    `;
    const [monthlyRevenue] = await db.execute(monthlyRevenueQuery);

    const monthlyRevenueData = monthlyRevenue.map(month => ({
      year: month.year,
      month: month.month,
      month_name: new Date(month.year, month.month - 1, 1).toLocaleString('es-ES', { month: 'long' }),
      revenue: parseFloat(month.revenue)
    }));

    // ===== 4. TODAY UPCOMING SESSIONS DATA =====
    
    const todayUpcomingSessionsQuery = `
      SELECT 
        s.start_time,
        p.name as patient_name,
        s.mode as session_type,
        c.name as clinic_name
      FROM sessions s
      INNER JOIN patients p ON s.patient_id = p.id
      INNER JOIN clinics c ON s.clinic_id = c.id
      WHERE s.session_date = ? 
        AND s.status = 'scheduled'
        AND s.start_time > ?
      ORDER BY s.start_time ASC
    `;
    const [todayUpcomingSessions] = await db.execute(todayUpcomingSessionsQuery, [today, currentTime]);

    const todayUpcomingSessionsData = todayUpcomingSessions.map(session => ({
      start_time: session.start_time,
      patient_name: session.patient_name,
      session_type: session.session_type,
      clinic_name: session.clinic_name
    }));

    // ===== 5. TOMORROW SESSIONS DATA =====
    
    // Calcular el próximo día laborable
    const tomorrow = new Date(now);
    const currentDayOfWeek = now.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    
    if (currentDayOfWeek === 5) {
      // Si es viernes (5), saltar al lunes (+3 días)
      tomorrow.setDate(tomorrow.getDate() + 3);
    } else if (currentDayOfWeek === 6) {
      // Si es sábado (6), saltar al lunes (+2 días)
      tomorrow.setDate(tomorrow.getDate() + 2);
    } else {
      // Cualquier otro día, simplemente +1 día
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const tomorrowSessionsQuery = `
      SELECT 
        s.start_time,
        p.name as patient_name,
        s.mode as session_type,
        c.name as clinic_name
      FROM sessions s
      INNER JOIN patients p ON s.patient_id = p.id
      INNER JOIN clinics c ON s.clinic_id = c.id
      WHERE s.session_date = ? 
        AND s.status = 'scheduled'
      ORDER BY s.start_time ASC
    `;
    const [tomorrowSessions] = await db.execute(tomorrowSessionsQuery, [tomorrowDate]);

    const tomorrowSessionsData = tomorrowSessions.map(session => ({
      start_time: session.start_time,
      patient_name: session.patient_name,
      session_type: session.session_type,
      clinic_name: session.clinic_name
    }));

    // ===== 6. DISTRIBUTION BY MODALITY DATA =====
    
    const distributionByModalityQuery = `
      SELECT 
        s.mode as session_modality,
        COUNT(*) as session_count
      FROM sessions s
      WHERE s.status IN ('completed', 'scheduled')
      GROUP BY s.mode
      ORDER BY session_count DESC
    `;
    const [distributionByModality] = await db.execute(distributionByModalityQuery);

    const distributionByModalityData = distributionByModality.map(item => ({
      modality_type: item.session_modality,
      session_count: item.session_count
    }));

    // ===== 7. PAYMENT METHODS DATA =====
    
    const paymentMethodsQuery = `
      SELECT 
        s.payment_method,
        COUNT(*) as method_count,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status IN ('completed', 'scheduled'))) as percentage
      FROM sessions s
      WHERE s.status IN ('completed', 'scheduled')
      GROUP BY s.payment_method
      ORDER BY method_count DESC
    `;
    const [paymentMethods] = await db.execute(paymentMethodsQuery);

    const paymentMethodsData = paymentMethods.map(item => ({
      payment_method: item.payment_method,
      percentage: Math.round(parseFloat(item.percentage) * 100) / 100
    }));

    // ===== RESPUESTA FINAL =====
    
    return {
      RapidKPIData: rapidKPIData,
      DistributionByModalityData: distributionByModalityData,
      MonthlyRevenueData: monthlyRevenueData,
      PaymentMethodsData: paymentMethodsData,
      SessionsByClinicData: sessionsByClinicData,
      TodayUpcomingSessionsData: todayUpcomingSessionsData,
      TomorrowSessionsData: tomorrowSessionsData
    };

  } catch (error) {
    console.error('Error al obtener KPIs del dashboard:', error);
    throw error;
  }
};

module.exports = {
  getDashboardKPIs,
};