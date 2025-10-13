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

// Support both 'web' and 'installed' credential formats (desktop vs web app)
let client_id, client_secret, redirect_uris;
if (credentials.web) {
  ({ client_id, client_secret, redirect_uris } = credentials.web);
  console.log('Using OAuth client type: web');
} else if (credentials.installed) {
  ({ client_id, client_secret, redirect_uris } = credentials.installed);
  console.log('Using OAuth client type: installed (desktop)');
} else {
  throw new Error('Invalid credentials.json: missing "web" or "installed" client configuration');
}

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  (redirect_uris && redirect_uris.length > 0) ? redirect_uris[0] : undefined
);

// Montar rutas de Google (auth-url protegido + callback público)
const googleRoutes = require('./routes/google/google_routes');
app.use('/api/google', googleRoutes);

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
