const { BrowserWindow } = require('electron');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('./google-credentials');

const DATA_DIR = path.join(os.homedir(), '.weekly-tracker');
const TOKENS_FILE = path.join(DATA_DIR, 'google-tokens.json');
const DRIVE_FILENAME = 'weekly-tracker-data.json';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

let oauth2Client = null;
let cachedFileId = null;

function isConfigured() {
  return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getSavedTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

function saveTokens(tokens) {
  ensureDataDir();
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

function clearTokens() {
  if (fs.existsSync(TOKENS_FILE)) fs.unlinkSync(TOKENS_FILE);
  cachedFileId = null;
  oauth2Client = null;
}

function createOAuth2Client(redirectUri) {
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
}

function getOAuth2Client() {
  if (oauth2Client) return oauth2Client;
  if (!isConfigured()) return null;
  oauth2Client = createOAuth2Client('http://127.0.0.1');
  const tokens = getSavedTokens();
  if (tokens) {
    oauth2Client.setCredentials(tokens);
    oauth2Client.on('tokens', (newTokens) => {
      const merged = { ...tokens, ...newTokens };
      saveTokens(merged);
    });
  }
  return oauth2Client;
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
    server.on('error', reject);
  });
}

async function authenticateWithGoogle(parentWindow) {
  if (!isConfigured()) {
    throw new Error('Google Drive is not available — OAuth credentials have not been configured by the developer.');
  }

  const { server, port } = await startLocalServer();
  const redirectUri = `http://127.0.0.1:${port}`;
  const client = createOAuth2Client(redirectUri);

  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  return new Promise((resolve, reject) => {
    let authWin;
    let settled = false;

    function finish(fn) {
      if (settled) return;
      settled = true;
      try { server.close(); } catch {}
      try { if (authWin && !authWin.isDestroyed()) authWin.close(); } catch {}
      fn();
    }

    server.on('request', async (req, res) => {
      try {
        const url = new URL(req.url, redirectUri);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<html><body style="font-family:system-ui;text-align:center;padding:60px"><h2>Authentication cancelled</h2><p>You can close this window.</p></body></html>');
          finish(() => reject(new Error('User denied access')));
          return;
        }

        if (code) {
          const { tokens } = await client.getToken(code);
          client.setCredentials(tokens);
          saveTokens(tokens);
          oauth2Client = client;
          oauth2Client.on('tokens', (newTokens) => {
            const saved = getSavedTokens() || {};
            saveTokens({ ...saved, ...newTokens });
          });
          cachedFileId = null;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<html><body style="font-family:system-ui;text-align:center;padding:60px"><h2 style="color:#4f46e5">&#10003; Signed in successfully!</h2><p>You can close this window and return to the app.</p></body></html>');

          const userInfo = await getUserInfo(client);
          finish(() => resolve(userInfo));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<html><body style="font-family:system-ui;text-align:center;padding:60px"><h2>Error</h2><p>${err.message}</p></body></html>`);
        finish(() => reject(err));
      }
    });

    authWin = new BrowserWindow({
      width: 600,
      height: 700,
      parent: parentWindow || undefined,
      modal: !!parentWindow,
      webPreferences: { nodeIntegration: false, contextIsolation: true },
      title: 'Sign in with Google',
    });
    authWin.loadURL(authUrl);

    authWin.on('closed', () => {
      finish(() => reject(new Error('Auth window closed')));
    });
  });
}

async function getUserInfo(client) {
  const oauthApi = google.oauth2({ version: 'v2', auth: client });
  try {
    const { data } = await oauthApi.userinfo.get();
    return { email: data.email, name: data.name, picture: data.picture };
  } catch {
    return { email: 'Unknown', name: 'Google User', picture: null };
  }
}

async function findOrCreateFile(drive) {
  if (cachedFileId) return cachedFileId;

  const res = await drive.files.list({
    q: `name='${DRIVE_FILENAME}' and trashed=false`,
    spaces: 'drive',
    fields: 'files(id, name)',
    pageSize: 1,
  });

  if (res.data.files && res.data.files.length > 0) {
    cachedFileId = res.data.files[0].id;
    return cachedFileId;
  }

  const createRes = await drive.files.create({
    requestBody: { name: DRIVE_FILENAME, mimeType: 'application/json' },
    media: { mimeType: 'application/json', body: '[]' },
    fields: 'id',
  });

  cachedFileId = createRes.data.id;
  return cachedFileId;
}

async function loadFromDrive() {
  const client = getOAuth2Client();
  if (!client || !client.credentials?.access_token) {
    throw new Error('Not authenticated with Google');
  }
  const drive = google.drive({ version: 'v3', auth: client });
  const fileId = await findOrCreateFile(drive);
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'text' });
  try {
    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function saveToDrive(items) {
  const client = getOAuth2Client();
  if (!client || !client.credentials?.access_token) {
    throw new Error('Not authenticated with Google');
  }
  const drive = google.drive({ version: 'v3', auth: client });
  const fileId = await findOrCreateFile(drive);
  await drive.files.update({
    fileId,
    media: { mimeType: 'application/json', body: JSON.stringify(items, null, 2) },
  });
  return true;
}

function getGoogleAuthStatus() {
  const tokens = getSavedTokens();
  return {
    isConfigured: isConfigured(),
    isAuthenticated: !!(tokens?.access_token),
  };
}

async function getGoogleUserInfo() {
  const client = getOAuth2Client();
  if (!client || !client.credentials?.access_token) return null;
  return getUserInfo(client);
}

module.exports = {
  authenticateWithGoogle,
  loadFromDrive,
  saveToDrive,
  getGoogleAuthStatus,
  getGoogleUserInfo,
  clearTokens,
};
