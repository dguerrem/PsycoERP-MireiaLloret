const dashboardPaths = {
  "/api/dashboard/kpis": {
    get: {
      tags: ["Dashboard"],
      summary: "Obtener KPIs rápidos del dashboard",
      description: "Obtiene los KPIs principales del dashboard incluyendo: sesiones del mes actual vs anterior, ingresos del mes vs anterior, pacientes activos, nuevos pacientes del mes, próximas citas de hoy y hora de la siguiente cita",
      responses: {
        200: {
          description: "KPIs obtenidos exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DashboardKPIsResponse",
              },
            },
          },
        },
        500: {
          description: "Error interno del servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};

module.exports = dashboardPaths;