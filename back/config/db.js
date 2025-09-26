const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+00:00', // UTC para evitar conversiones automáticas
  dateStrings: true, // Mantener fechas como strings para evitar conversiones
};

// Crear el pool de conexiones
const db = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Conexión a MariaDB establecida correctamente");
    connection.release();
  } catch (error) {
    console.error("❌ Error al conectar con MariaDB:", error.message);
  }
};

module.exports = { db, testConnection };
