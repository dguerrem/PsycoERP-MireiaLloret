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
        WHERE is_active = true
    `;

  // Query principal para obtener datos
  let dataQuery = `
        SELECT 
            id,
            name,
            email,
            phone,
            dni,
            status,
            session_type,
            address,
            DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date,
            emergency_contact_name,
            emergency_contact_phone,
            medical_history,
            current_medication,
            allergies,
            referred_by,
            insurance_provider,
            insurance_number,
            notes,
            DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,
            updated_at
        FROM patients
        WHERE is_active = true
    `;

  const params = [];
  const conditions = [];

  // Aplicar filtros
  if (filters.name) {
    conditions.push("name LIKE ?");
    params.push(`%${filters.name}%`);
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

  if (filters.session_type) {
    conditions.push("session_type = ?");
    params.push(filters.session_type);
  }

  if (filters.insurance_provider) {
    conditions.push("insurance_provider LIKE ?");
    params.push(`%${filters.insurance_provider}%`);
  }

  if (filters.referred_by) {
    conditions.push("referred_by LIKE ?");
    params.push(`%${filters.referred_by}%`);
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
            phone,
            session_type as tipo
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
            type as tipo_sesion,
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
            name as nombre,
            dni,
            DATE_FORMAT(birth_date, '%Y-%m-%d') as fecha_nacimiento,
            status as estado,
            email,
            phone as telefono,
            address as direccion,
            emergency_contact_name as contacto_emergencia,
            emergency_contact_phone as telefono_emergencia,
            notes as notas
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
            s.type as tipo,
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
  
  // Consulta para obtener bonuses del paciente con KPIs
  const bonusKpisQuery = `
        SELECT 
            COUNT(*) as total_bonos,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as total_activos,
            SUM(CASE WHEN status = 'consumed' THEN 1 ELSE 0 END) as total_consumidos,
            SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as total_expirados
        FROM bonuses
        WHERE patient_id = ?
    `;
  
  const [bonusKpisRows] = await db.execute(bonusKpisQuery, [id]);
  const bonusKpis = bonusKpisRows[0];

  // Consulta para obtener detalles de bonuses del paciente
  const bonusesQuery = `
        SELECT 
            id as idBono,
            total_sessions as sesiones_totales,
            price_per_session as euros_por_sesion,
            total_price as precio_total,
            DATE_FORMAT(purchase_date, '%Y-%m-%d') as fecha_compra,
            DATE_FORMAT(expiry_date, '%Y-%m-%d') as fecha_expiracion,
            (total_sessions - used_sessions) as sesiones_restantes,
            used_sessions as sesiones_utilizadas,
            status as estado_bono
        FROM bonuses
        WHERE patient_id = ?
        ORDER BY purchase_date DESC
    `;
  
  const [bonusesRows] = await db.execute(bonusesQuery, [id]);

  // Consulta para obtener notas clínicas del paciente
  const clinicalNotesQuery = `
        SELECT 
            title as titulo,
            content as contenido,
            DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as fecha
        FROM clinical_notes
        WHERE patient_id = ?
        ORDER BY date DESC
    `;
  
  const [clinicalNotesRows] = await db.execute(clinicalNotesQuery, [id]);

  const patientResumeData = patientRows[0];
  patientResumeData.PatientResumeSessions = sessionsRows;
  
  return {
    PatientResume: patientResumeData,
    PatientData: patientDataRows[0] || {},
    PatientMedicalRecord: clinicalNotesRows,
    PatientSessions: patientSessionsRows,
    PatientBonus: {
      kpis: {
        total_bonos: parseInt(bonusKpis.total_bonos) || 0,
        total_activos: parseInt(bonusKpis.total_activos) || 0,
        total_consumidos: parseInt(bonusKpis.total_consumidos) || 0,
        total_expirados: parseInt(bonusKpis.total_expirados) || 0
      },
      bonuses: bonusesRows
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

module.exports = {
  getPatients,
  getPatientById,
  deletePatient,
};