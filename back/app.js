const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const { swaggerUi, swaggerDefinition, swaggerOptions } = require('./swagger/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔧 SWAGGER UI - Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition, swaggerOptions));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Psicología funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      sessions: '/api/sessions'
    }
  });
});

// Importar y usar rutas
const sessionsRoutes = require('./routes/sessions/sessions_routes');
app.use('/api/sessions', sessionsRoutes);

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    
    // Probar conexión a la base de datos
    await testConnection();
});