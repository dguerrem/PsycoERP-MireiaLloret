const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const definitions = require("./definitions");
const authPaths = require("./paths/auth");
const sessionsPaths = require("./paths/sessions");
const patientsPaths = require("./paths/patients");
const bonusesPaths = require("./paths/bonuses");
const clinicsPaths = require("./paths/clinics");
const dashboardPaths = require("./paths/dashboard");
const clinicalNotesPaths = require("./paths/clinical_notes");
const remindersPaths = require("./paths/reminders");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Psicología",
    version: "1.0.0",
    description: "API REST para la gestión de sesiones de psicología",
    contact: {
      name: "Desarrollo",
      email: "dev@psicologia.com",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Servidor de desarrollo",
    },
  ],
  components: {
    schemas: definitions,
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token obtenido del endpoint de login",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...authPaths,
    ...sessionsPaths,
    ...patientsPaths,
    ...bonusesPaths,
    ...clinicsPaths,
    ...dashboardPaths,
    ...clinicalNotesPaths,
    ...remindersPaths,
  },
  tags: [
    {
      name: "Auth",
      description: "Autenticación de usuarios",
    },
    {
      name: "Sessions",
      description: "Gestión de sesiones de terapia",
    },
    {
      name: "Patients",
      description: "Gestión de pacientes",
    },
    {
      name: "Bonuses",
      description: "Gestión de bonuses de pacientes",
    },
    {
      name: "Clinics",
      description: "Gestión de clínicas",
    },
    {
      name: "Dashboard",
      description: "KPIs y métricas del dashboard",
    },
    {
      name: "Clinical Notes",
      description: "Gestión de notas clínicas e historial médico",
    },
    {
      name: "Reminders",
      description: "Gestión de recordatorios de sesiones",
    },
  ],
};

// Configuración de Swagger UI
const swaggerOptions = {
  explorer: true,
  customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #3b82f6; }
    `,
  customSiteTitle: "API Psicología - Documentación",
  swaggerOptions: {
    filter: true,
    showRequestHeaders: true,
  },
};

module.exports = {
  swaggerUi,
  swaggerDefinition,
  swaggerOptions,
};
