const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CREDENTIALS_PATH = path.join(__dirname, '../.secret/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../.secret/token.json');

(async () => {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('No se encontró el archivo de credenciales en', CREDENTIALS_PATH);
      process.exit(1);
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_id, client_secret, redirect_uris } = credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
    });

    console.log('Visita la siguiente URL en un navegador y acepta los permisos:');
    console.log(authUrl);

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Pega el código de autorización aquí: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code.trim());
        // Guardar token
        fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        console.log('Token guardado en', TOKEN_PATH);
        console.log('Asegúrate de mantener este archivo seguro.');
      } catch (err) {
        console.error('Error al obtener token:', err.response?.data || err.message);
      }
    });

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
