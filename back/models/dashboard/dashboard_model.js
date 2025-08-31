const { db } = require("../../config/db");

// Obtener KPIs del dashboard - por ahora un select * from Patients
const getDashboardKPIs = async () => {
  const query = `
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
        ORDER BY created_at DESC
    `;

  const [rows] = await db.execute(query);
  return rows;
};

module.exports = {
  getDashboardKPIs,
};