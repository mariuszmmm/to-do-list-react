# Google Drive Backup & Restore - Setup

## Required Environment Variables

### Frontend (.env.local or Netlify UI)

```env
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=YOUR_CLIENT_ID_HERE
REACT_APP_GOOGLE_DRIVE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

### Backend (Netlify Functions)

Add the following variables in your Netlify project settings:

```env
MONGODB_URI=your_mongodb_uri
MONGODB_DATABASE=your_database_name
GOOGLE_DRIVE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_DRIVE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_DRIVE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

## Google OAuth 2.0 Setup

### 1. Create a Project in Google Cloud Console

1. Go to https://console.cloud.google.com/
2. Log in to your Google account
3. Click "Select a Project" → "NEW PROJECT"
4. Enter a project name (e.g., "To-Do List Backup")
5. Click "CREATE"

### 2. Enable Google Drive API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click the result and click "ENABLE"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted for consent screen:
   - Click "CONFIGURE CONSENT SCREEN"
   - Choose "External" (for testing)
   - Fill in required fields:
     - App name: "To-Do List"
     - User support email: your email
     - Developer contact: your email
   - Skip the rest and click "SAVE AND CONTINUE" → "SAVE AND CONTINUE" → "BACK TO DASHBOARD"

4. Return to Credentials, click "CREATE CREDENTIALS" → "OAuth client ID"
5. Choose "Web application"
6. Add to "Authorized redirect URIs":
   - `http://localhost:3000/auth/google/callback` (for dev)
   - `https://yourdomain.com/auth/google/callback` (for production)
7. Click "CREATE"
8. Copy the Client ID and Client Secret

### 4. Add Variables to Netlify

1. In the Netlify dashboard, go to Site settings → Build & deploy → Environment
2. Add variables:
   - `GOOGLE_DRIVE_CLIENT_ID` = copied Client ID
   - `GOOGLE_DRIVE_CLIENT_SECRET` = copied Client Secret
   - `GOOGLE_DRIVE_REDIRECT_URI` = `https://yourdomain.com/auth/google/callback`

3. In your .env.local file, add frontend variables:
   ```env
   REACT_APP_GOOGLE_DRIVE_CLIENT_ID=Copied_Client_ID
   REACT_APP_GOOGLE_DRIVE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
   ```

## How the Flow Works

### Downloading Backup to Local Disk

1. Admin clicks the "Download Backup" button
2. The app fetches data from `/backupData`
3. Data is saved as a JSON file to disk

### Uploading Backup to Google Drive

1. Admin clicks "Authorize Google" if not logged in
2. Redirected to Google login
3. After login, the app fetches data from `/backupData`
4. Data is sent to Google Drive via `/backup-uploadAllUsersToGoogleDrive`
5. Backup is saved in the user's Google Drive

### Restoring from Google Drive

1. Admin must be logged in (steps 1-2 above)
2. Admin clicks "Restore from Google Drive"
3. Enters the backup File ID (file picker to be implemented)
4. System fetches the file from Google Drive and restores data in MongoDB
5. The app reloads to reflect the restored data

## Netlify Functions

### /backupData (GET)
- **Requires**: Authorization header
- **Returns**: Backup JSON with all lists and tasks
- **Available to**: Logged-in users

### /backup-uploadAllUsersToGoogleDrive (POST)
- **Requires**: Authorization header + backupData + accessToken
- **Returns**: File ID and file name on Google Drive
- **Available to**: Logged-in users with Google auth

### /backup-restoreBackupFromGoogleDrive (POST)
- **Requires**: Authorization header + fileId + accessToken
- **Returns**: Number of restored lists
- **Available to**: Logged-in users with Google auth

## Security

⚠️ **WARNING**: The current implementation stores the access token on the client side in localStorage.

For production, it is recommended to:
- Store the refresh token on the server
- Exchange the OAuth code for a token on the backend (not frontend)
- Add extra authorization validation
- Encrypt sensitive data

## Troubleshooting

**Problem**: "Missing Google Drive configuration"
- **Solution**: Check if `REACT_APP_GOOGLE_DRIVE_CLIENT_ID` and `REACT_APP_GOOGLE_DRIVE_REDIRECT_URI` are set in .env.local

**Problem**: "Redirect URI mismatch"
- **Solution**: Make sure the URI in Google Console exactly matches `REACT_APP_GOOGLE_DRIVE_REDIRECT_URI`

**Problem**: 401 Unauthorized when uploading
- **Solution**: Access token may be expired. Try logging in to Google again.

## Future Improvements

- [ ] Google Drive file picker instead of entering File ID
- [ ] List available backups in Google Drive
- [ ] Automatic backups
- [ ] Scheduled backups (daily, weekly, etc.)
- [ ] Backup encryption
- [ ] Selective restore (choose which lists to restore)
- [ ] Backend token management (not localStorage)
