const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/db");
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
const remindersRoutes = require("./routes/reminders/reminders_routes");
const usersRoutes = require("./routes/users/users_routes");

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      reminders: "/api/reminders",
      users: "/api/users",
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
app.use("/api/reminders", remindersRoutes);
app.use("/api/users", usersRoutes);

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

  // Probar conexión a la base de datos
  await testConnection();
});
