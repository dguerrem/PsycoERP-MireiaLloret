const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Archivo de credenciales que descargaste de Google Cloud
const CREDENTIALS_PATH = path.join(__dirname, "../.secret/credentials.json");
const TOKEN_PATH = path.join(__dirname, "../.secret/token.json"); // Donde se guardará el token

const initializeGoogleAuth = async () => {
    try {
        const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
        const { client_id, client_secret, redirect_uris } = credentials.web;

        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        // Intenta cargar el token guardado
        if (fs.existsSync(TOKEN_PATH)) {
            const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
            // Si el token no incluye refresh_token avisar para reautorizar
            if (!token.refresh_token) {
                console.warn("El token cargado no contiene refresh_token. Es posible que no se pueda renovar automáticamente: considera reautorizar para obtener refresh_token.");
            }
            oAuth2Client.setCredentials(token);
        } else {
            // Genera la URL de autorización solicitando refresh_token explícitamente
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                prompt: "consent",
                scope: ["https://www.googleapis.com/auth/calendar.events"],
            });
            console.log("Autoriza esta aplicación visitando esta URL y pega el código resultante:", authUrl);
            throw new Error("Se necesita autorización manual. Sigue el enlace y genera el token.");
        }

        return google.calendar({ version: "v3", auth: oAuth2Client });

    } catch (error) {
        console.error("Error al inicializar la autenticación:", error.message);
        if (error.response && error.response.data) {
            console.error("Google API response:", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
};

module.exports = { initializeGoogleAuth };