const express = require('express');
const { testConnection } = require('./config/db');
const app = express();
const port = 3000;

require('dotenv').config();
app.get('/', (req, res) => {
  res.send('¡Hola, mundo con Express!');
});

// Iniciar servidor
app.listen(port, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`🔧 Interfaz de testing en http://localhost:${port}/swagger`);
    
    await testConnection();
});