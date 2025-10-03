const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const { testConnection, dbMiddleware } = require("./config/db");
const {
  swaggerUi,
  swaggerDefinition,
  swaggerOptions,
} = require("./swagger/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

const { authenticateToken } = require("./middlewares/auth");
const authRoutes = require("./routes/auth/auth_routes");
const sessionsRoutes = require("./routes/sessions/sessions_routes");
const patientsRoutes = require("./routes/patients/patients_routes");
const bonusesRoutes = require("./routes/bonuses/bonuses_routes");
const clinicsRoutes = require("./routes/clinics/clinics_routes");
const dashboardRoutes = require("./routes/dashboard/dashboard_routes");
const clinicalNotesRoutes = require("./routes/clinical_notes/clinical_notes_routes");
const documentsRoutes = require("./routes/documents/documents_routes");
const remindersRoutes = require("./routes/reminders/reminders_routes");
const usersRoutes = require("./routes/users/users_routes");
const invoicesRoutes = require("./routes/invoices/invoices_routes");

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Aumentar límite para archivos grandes
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Middleware para inyectar el pool de BD correcto según hostname
app.use(dbMiddleware);

// Configuración de credenciales de Google OAuth 2.0
const CREDENTIALS_PATH = path.join(__dirname, ".secret", "credentials.json");
const TOKEN_PATH = path.join(__dirname, ".secret", "token.json");
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Ruta para el manejo del callback de Google
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Falta el código de autorización.");
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Guarda el token para futuros usos
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    
    res.send(
      "Autenticación con Google completada con éxito. Ya puedes cerrar esta ventana."
    );
  } catch (error) {
    console.error("Error al obtener el token:", error);
    res.status(500).send("Error durante la autenticación.");
  }
});

// 🔧 SWAGGER UI - Documentación
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition, swaggerOptions)
);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API de Psicología funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      sessions: "/api/sessions",
      patients: "/api/patients",
      bonuses: "/api/bonuses",
      clinics: "/api/clinics",
      dashboard: "/api/dashboard",
      clinical_notes: "/api/clinical-notes",
      documents: "/api/documents",
      reminders: "/api/reminders",
      users: "/api/users",
      invoices: "/api/invoices",
    },
  });
});

// Rutas públicas (sin autenticación)
app.use("/api/auth", authRoutes);

// Middleware global de autenticación para todas las rutas protegidas
app.use(authenticateToken);

// Rutas protegidas (requieren autenticación)
app.use("/api/sessions", sessionsRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/bonuses", bonusesRoutes);
app.use("/api/clinics", clinicsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/clinical-notes", clinicalNotesRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/invoices", invoicesRoutes);

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

  // Probar conexión a la base de datos
  await testConnection();
});
