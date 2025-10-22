const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

/**
 * Determina qué credenciales de Google usar según el hostname
 * Sigue el mismo patrón que db.js para consistencia
 */
const getGoogleCredentialsPath = (hostname) => {
  // Localhost siempre usa TEST
  if (hostname === "127.0.0.1" || hostname === "localhost") {
    return {
      credentials: path.join(__dirname, "../.secret/credentials.test.json"),
      token: path.join(__dirname, "../.secret/token.test.json"),
      environment: "TEST (localhost)",
    };
  }

  // Si incluye "test." usa credenciales de test
  if (hostname && hostname.includes("test.")) {
    return {
      credentials: path.join(__dirname, "../.secret/credentials.test.json"),
      token: path.join(__dirname, "../.secret/token.test.json"),
      environment: "TEST",
    };
  }

  // Por defecto (producción)
  return {
    credentials: path.join(__dirname, "../.secret/credentials.production.json"),
    token: path.join(__dirname, "../.secret/token.production.json"),
    environment: "PRODUCTION",
  };
};

/**
 * Inicializa Google Calendar API con las credenciales apropiadas según el hostname
 * @param {string} hostname - El hostname de la request (req.hostname)
 * @returns {Promise} Google Calendar API client
 */
const initializeGoogleAuth = async (hostname) => {
  try {
    const paths = getGoogleCredentialsPath(hostname);

    console.log(`🔐 Google OAuth - Environment: ${paths.environment}`);
    console.log(`   Hostname: ${hostname || "not provided (defaults to production)"}`);
    console.log(`   Credentials: ${path.basename(paths.credentials)}`);
    console.log(`   Token: ${path.basename(paths.token)}`);

    // Verificar que existan los archivos
    if (!fs.existsSync(paths.credentials)) {
      throw new Error(
        `Credentials file not found: ${paths.credentials}\n` +
        `Please ensure you have generated credentials for ${paths.environment} environment.`
      );
    }

    const credentials = JSON.parse(fs.readFileSync(paths.credentials));
    const { client_id, client_secret, redirect_uris } = credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Intenta cargar el token guardado
    if (fs.existsSync(paths.token)) {
      const token = JSON.parse(fs.readFileSync(paths.token));
      
      // Si el token no incluye refresh_token avisar para reautorizar
      if (!token.refresh_token) {
        console.warn(
          `⚠️  Token for ${paths.environment} does not contain refresh_token. ` +
          `Consider reauthorizing to obtain a refresh_token.`
        );
      }
      
      oAuth2Client.setCredentials(token);

      // 🔄 RENOVACIÓN AUTOMÁTICA: Configurar listener para renovar tokens automáticamente
      oAuth2Client.on('tokens', (newTokens) => {
        console.log(`🔄 Token refreshed automatically for ${paths.environment}`);
        
        // Actualizar el token guardado con el nuevo access_token
        const updatedToken = { ...token };
        if (newTokens.access_token) {
          updatedToken.access_token = newTokens.access_token;
        }
        if (newTokens.expiry_date) {
          updatedToken.expiry_date = newTokens.expiry_date;
        }
        // Solo actualizar refresh_token si viene uno nuevo (raro pero posible)
        if (newTokens.refresh_token) {
          updatedToken.refresh_token = newTokens.refresh_token;
        }
        
        // Guardar el token actualizado
        try {
          fs.writeFileSync(paths.token, JSON.stringify(updatedToken, null, 2));
          console.log(`✅ Token saved successfully for ${paths.environment}`);
        } catch (writeError) {
          console.error(`❌ Error saving refreshed token for ${paths.environment}:`, writeError.message);
        }
      });
      
    } else {
      // Genera la URL de autorización solicitando refresh_token explícitamente
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/calendar.events"],
      });
      console.log(
        `❌ Token file not found for ${paths.environment}: ${paths.token}\n` +
        `   Authorize this app by visiting this URL: ${authUrl}`
      );
      throw new Error(
        `Manual authorization needed for ${paths.environment}. ` +
        `Follow the link above and generate the token.`
      );
    }

    return google.calendar({ version: "v3", auth: oAuth2Client });
  } catch (error) {
    console.error("❌ Error initializing Google Auth:", error.message);
    if (error.response && error.response.data) {
      console.error("Google API response:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

module.exports = { initializeGoogleAuth, getGoogleCredentialsPath };