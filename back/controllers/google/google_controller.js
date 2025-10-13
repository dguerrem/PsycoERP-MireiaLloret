const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../../.secret/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../.secret/token.json');

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('credentials.json not found in .secret folder');
  }
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  if (credentials.web) return credentials.web;
  if (credentials.installed) return credentials.installed;
  throw new Error('Invalid credentials.json: missing web or installed');
}

function createOAuthClient() {
  const { client_id, client_secret, redirect_uris } = loadCredentials();
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris && redirect_uris[0]);
}

exports.getAuthUrl = (req, res) => {
  try {
    const oAuth2Client = createOAuthClient();
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
    });
    res.json({ authUrl });
  } catch (err) {
    console.error('Error generating auth URL', err);
    res.status(500).json({ error: err.message });
  }
};

exports.oauth2callback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');

  try {
    const oAuth2Client = createOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);
    // Save tokens
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('Saved token to', TOKEN_PATH);
    res.send('Token saved successfully. You can close this window.');
  } catch (err) {
    console.error('Error exchanging code for token', err);
    res.status(500).send('Error obtaining token');
  }
};
