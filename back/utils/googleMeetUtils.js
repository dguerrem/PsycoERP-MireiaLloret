const { initializeGoogleAuth } = require("../config/googleMeet");

const crearSesionGoogleMeet = async (sessionData) => {
  try {
    const calendar = await initializeGoogleAuth();

    console.log("Datos recibidos:", {
      session_date: sessionData.session_date,
      start_time: sessionData.start_time,
      end_time: sessionData.end_time,
    });

    const fechaSesion = new Date(sessionData.session_date);
    const año = fechaSesion.getUTCFullYear();
    const mes = String(fechaSesion.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(fechaSesion.getUTCDate()).padStart(2, "0");
    const fechaFormateada = `${año}-${mes}-${dia}`;

    const horaInicio = sessionData.start_time.substring(0, 5);
    const horaFin = sessionData.end_time.substring(0, 5);

    const startDateTime = new Date(`${fechaFormateada}T${horaInicio}:00`);
    const endDateTime = new Date(`${fechaFormateada}T${horaFin}:00`);

    console.log("Fechas procesadas:", {
      fechaFormateada,
      horaInicio,
      horaFin,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    });

    const event = {
      summary: `Sesión Psicológica - ${sessionData.patient_name}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Europe/Madrid",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Europe/Madrid",
      },
      conferenceData: {
        createRequest: {
          requestId: `psico-${sessionData.session_id}-${Date.now()}`,
          conferenceSolution: {
            key: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    };

    console.log("Evento a crear:", JSON.stringify(event, null, 2));

    const response = await calendar.events.insert({
      calendarId: "dacormus@gmail.com",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    console.log(
      "Respuesta completa de Google:",
      JSON.stringify(response.data, null, 2)
    );
    console.log("Conference data:", response.data.conferenceData);

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
    console.log("Google Meet creado exitosamente:", meetLink);

    return meetLink;
  } catch (error) {
    console.error("Error detallado:", error.message);
    console.error("Causa:", error.cause?.message);
    throw new Error("No se pudo crear la sesión de Google Meet");
  }
};

module.exports = { crearSesionGoogleMeet };
