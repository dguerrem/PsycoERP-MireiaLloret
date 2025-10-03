// Obtener KPIs de facturación con filtros opcionales de mes/año
const getInvoicesKPIs = async (db, filters = {}) => {
  const { month, year } = filters;

  // Por defecto usar mes y año actual si no se especifican
  const currentDate = new Date();
  const targetMonth = month || (currentDate.getMonth() + 1);
  const targetYear = year || currentDate.getFullYear();
  
  console.log(`Calculando KPIs para mes: ${targetMonth}, año: ${targetYear}`);
  // ============================================
  // CARD 1: Total de facturas emitidas (histórico)
  // ============================================
  const [totalInvoicesResult] = await db.execute(
    `SELECT COUNT(*) as total_invoices FROM invoices WHERE is_active = true`
  );
  const totalInvoices = parseInt(totalInvoicesResult[0].total_invoices) || 0;

  // ============================================
  // CARD 2: Total facturado bruto (histórico)
  // ============================================
  const [totalGrossResult] = await db.execute(
    `SELECT COALESCE(SUM(s.price), 0) as total_gross
     FROM sessions s
     INNER JOIN clinics c ON s.clinic_id = c.id AND c.is_active = true
     WHERE s.is_active = true`
  );
  const totalGrossHistoric = parseFloat(totalGrossResult[0].total_gross) || 0;

  // ============================================
  // CARD 3: Total facturado bruto (filtrado por mes/año)
  // ============================================
  const [totalGrossFilteredResult] = await db.execute(
    `SELECT COALESCE(SUM(s.price), 0) as total_gross_filtered
     FROM sessions s
     INNER JOIN clinics c ON s.clinic_id = c.id AND c.is_active = true
     WHERE s.is_active = true
       AND MONTH(s.session_date) = ?
       AND YEAR(s.session_date) = ?`,
    [targetMonth, targetYear]
  );
  const totalGrossFiltered = parseFloat(totalGrossFilteredResult[0].total_gross_filtered) || 0;

  // ============================================
  // CARD 4: Total facturado NETO (filtrado por mes/año)
  // Calculado con: sessions.price * (clinics.percentage / 100)
  // ============================================
  const [totalNetFilteredResult] = await db.execute(
    `SELECT COALESCE(SUM(s.price * (c.percentage / 100)), 0) as total_net_filtered
     FROM sessions s
     INNER JOIN clinics c ON s.clinic_id = c.id AND c.is_active = true
     WHERE s.is_active = true
       AND MONTH(s.session_date) = ?
       AND YEAR(s.session_date) = ?`,
    [targetMonth, targetYear]
  );
  console.log('CARD 4 - Total Neto Raw:', totalNetFilteredResult[0].total_net_filtered);
  const totalNetFiltered = parseFloat(totalNetFilteredResult[0].total_net_filtered) || 0;
  console.log('CARD 4 - Total Neto Parsed:', totalNetFiltered);

  // ============================================
  // CARD 5: Total facturado NETO por clínica (filtrado por mes/año)
  // ============================================
  const [totalNetByClinicResult] = await db.execute(
    `SELECT
       c.name as clinic_name,
       c.percentage as clinic_percentage,
       COUNT(s.id) as total_sessions,
       COALESCE(SUM(s.price), 0) as total_gross,
       COALESCE(SUM(s.price * (c.percentage / 100)), 0) as total_net
     FROM clinics c
     LEFT JOIN sessions s ON s.clinic_id = c.id
       AND s.is_active = true
       AND MONTH(s.session_date) = ?
       AND YEAR(s.session_date) = ?
     WHERE c.is_active = true
     GROUP BY c.id, c.name, c.percentage
     ORDER BY total_net DESC`,
    [targetMonth, targetYear]
  );

  const totalNetByClinic = totalNetByClinicResult.map(row => ({
    clinic_name: row.clinic_name,
    total_sessions: parseInt(row.total_sessions) || 0,
    total_gross: parseFloat(row.total_gross) || 0,
    clinic_percentage: parseFloat(row.clinic_percentage) || 0,
    total_net: parseFloat(row.total_net) || 0
  }));

  return {
    filters_applied: {
      month: targetMonth,
      year: targetYear
    },
    card1_total_invoices_issued: totalInvoices,
    card2_total_gross_historic: parseFloat(totalGrossHistoric.toFixed(2)),
    card3_total_gross_filtered: parseFloat(totalGrossFiltered.toFixed(2)),
    card4_total_net_filtered: parseFloat(totalNetFiltered.toFixed(2)),
    card5_total_net_by_clinic: totalNetByClinic
  };
};

// Obtener sesiones pendientes de facturar agrupadas por paciente
const getPendingInvoices = async (db, filters = {}) => {
  const { month, year } = filters;

  // Por defecto usar mes y año actual si no se especifican
  const currentDate = new Date();
  const targetMonth = month || (currentDate.getMonth() + 1);
  const targetYear = year || currentDate.getFullYear();

  console.log(`Obteniendo sesiones pendientes para mes: ${targetMonth}, año: ${targetYear}`);

  const [pendingSessionsResult] = await db.execute(
    `SELECT
       p.id as patient_id,
       CONCAT(p.first_name, ' ', p.last_name) as patient_full_name,
       p.dni,
       p.email,
       c.name as clinic_name,
       GROUP_CONCAT(s.id ORDER BY s.session_date ASC) as session_ids,
       COUNT(s.id) as pending_sessions_count,
       COALESCE(SUM(s.price), 0) as total_gross
     FROM patients p
     INNER JOIN sessions s ON s.patient_id = p.id
       AND s.is_active = true
       AND s.invoiced = 0
       AND MONTH(s.session_date) = ?
       AND YEAR(s.session_date) = ?
     INNER JOIN clinics c ON s.clinic_id = c.id AND c.is_active = true
     WHERE p.is_active = true
     GROUP BY p.id, p.first_name, p.last_name, p.dni, p.email, c.name
     ORDER BY patient_full_name ASC`,
    [targetMonth, targetYear]
  );

  const pendingInvoices = pendingSessionsResult.map(row => ({
    patient_id: parseInt(row.patient_id),
    patient_full_name: row.patient_full_name,
    dni: row.dni || '',
    email: row.email || '',
    clinic_name: row.clinic_name,
    session_ids: row.session_ids ? row.session_ids.split(',').map(id => parseInt(id)) : [],
    pending_sessions_count: parseInt(row.pending_sessions_count),
    total_gross: parseFloat(row.total_gross)
  }));

  return {
    filters_applied: {
      month: targetMonth,
      year: targetYear
    },
    pending_invoices: pendingInvoices
  };
};

module.exports = {
  getInvoicesKPIs,
  getPendingInvoices
};
