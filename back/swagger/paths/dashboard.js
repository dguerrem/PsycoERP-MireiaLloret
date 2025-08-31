const dashboardPaths = {
  "/api/dashboard/kpis": {
    get: {
      tags: ["Dashboard"],
      summary: "Obtener datos completos del dashboard",
      description: "Obtiene todos los datos necesarios para el dashboard incluyendo: 1) RapidKPIData: KPIs rápidos (sesiones, ingresos, pacientes, citas), 2) SessionsByClinicData: sesiones agrupadas por clínica para gráfico circular con filtros por año, 3) MonthlyRevenueData: ingresos por mes para gráfico de líneas de los últimos 12 meses",
      responses: {
        200: {
          description: "Datos del dashboard obtenidos exitosamente",
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