const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const definitions = require('./definitions');
const sessionsPaths = require('./paths/sessions');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Psicología',
        version: '1.0.0',
        description: 'API REST para la gestión de sesiones de psicología',
        contact: {
            name: 'Desarrollo',
            email: 'dev@psicologia.com'
        }
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3000}`,
            description: 'Servidor de desarrollo'
        }
    ],
    components: {
        schemas: definitions
    },
    paths: {
        ...sessionsPaths
    },
    tags: [
        {
            name: 'Sessions',
            description: 'Gestión de sesiones de terapia'
        }
    ]
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
        showRequestHeaders: true
    }
};

module.exports = {
    swaggerUi,
    swaggerDefinition,
    swaggerOptions
};