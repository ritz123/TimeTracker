// ──────────────────────────────────────────────────────────────
// ONE-TIME DEVELOPER SETUP — fill these in, then never touch again.
//
// 1. Go to https://console.cloud.google.com
// 2. Create a project (or pick an existing one)
// 3. APIs & Services → Library → search "Google Drive API" → Enable
// 4. APIs & Services → OAuth consent screen
//    - Choose "External", fill in App name + your email
//    - Add scopes: .../auth/drive.file, .../auth/userinfo.email,
//      .../auth/userinfo.profile
//    - Under "Test users", add the Google emails of anyone who
//      will use the app (required while app is in "Testing" status)
//    - Save
// 5. APIs & Services → Credentials → Create Credentials → OAuth client ID
//    - Application type: ★ "Desktop app" ★  (NOT "Web application")
//    - Name: anything you like
//    - No redirect URIs needed — Google allows localhost automatically
// 6. Copy the Client ID and Client Secret below
// ──────────────────────────────────────────────────────────────

module.exports = {
  GOOGLE_CLIENT_ID: '513123509477-b80cjofj9jcerfula3kuv6258hot88uk.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: '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',
};
