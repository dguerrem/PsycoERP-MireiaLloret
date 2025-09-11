const remindersPaths = {
  "/api/reminders/pending": {
    get: {
      tags: ["Reminders"],
      summary: "Obtener recordatorios pendientes",
      description: "Obtiene las sesiones del día siguiente con información de recordatorios. Lógica especial: Lunes-Jueves muestra sesiones del día siguiente, Viernes-Domingo muestra sesiones del lunes siguiente.",
      responses: {
        200: {
          description: "Lista de recordatorios pendientes obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RemindersResponse",
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

module.exports = remindersPaths;