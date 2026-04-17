// Reads Google OAuth credentials from environment variables.
// For local development, create a .env file in the project root (it's gitignored).
// For CI/CD builds (e.g. GitHub Actions), set these as repository secrets.

module.exports = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
};
