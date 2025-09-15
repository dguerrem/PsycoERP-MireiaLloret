const { db } = require("../../config/db");

const getUserById = async (userId) => {
  const query = `
    SELECT 
      id,
      name,
      dni,
      street,
      street_number,
      door,
      city,
      province,
      postal_code
    FROM users
    WHERE id = ? AND is_active = true
  `;
  
  const [rows] = await db.execute(query, [userId]);
  
  if (rows.length === 0) {
    return null;
  }
  
  return rows[0];
};

module.exports = {
  getUserById,
};