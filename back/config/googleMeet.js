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
            oAuth2Client.setCredentials(token);
        } else {
            // Genera la URL de autorización
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: ["https://www.googleapis.com/auth/calendar.events"],
            });
            console.log("Autoriza esta aplicación visitando esta URL:", authUrl);
            throw new Error("Se necesita autorización manual. Sigue el enlace.");
        }

        return google.calendar({ version: "v3", auth: oAuth2Client });

    } catch (error) {
        console.error("Error al inicializar la autenticación:", error.message);
        throw error;
    }
};

module.exports = { initializeGoogleAuth };