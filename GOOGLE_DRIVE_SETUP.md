# Environment Variables Setup for Google Drive Backup Feature

## Required Environment Variables

To enable Google Drive backup functionality, you need to set up Google OAuth credentials and configure the following environment variables:

### Frontend Environment Variables (`.env` file in project root)

```env
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=your_google_client_id_here
REACT_APP_GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/
```

**File location**: `d:\dev\to-do-list-react\.env`

### Backend Environment Variables (Netlify Secrets - Production Only)

Configure these in Netlify Dashboard under **Site Settings → Build & Deploy → Environment**:

```env
GOOGLE_DRIVE_CLIENT_ID=your_google_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_DRIVE_REDIRECT_URI=https://your-netlify-site.netlify.app/
```

## How to Get Google OAuth Credentials - Step by Step

### 1. Go to Google Cloud Console
- Open https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create a New Project
- Click on "Select a Project" at the top
- Click "NEW PROJECT"
- Enter project name (e.g., "to-do-list-backup")
- Click "CREATE"
- Wait for the project to be created

### 3. Enable Google Drive API
- In the search bar at the top, type "Google Drive API"
- Click on the first result
- Click "ENABLE"

### 4. Create OAuth 2.0 Credentials
- Go to "Credentials" in the left sidebar
- Click "CREATE CREDENTIALS"
- Select "OAuth client ID"
- Choose "Web application"
- Enter name (e.g., "to-do-list-client")

### 5. Configure Authorized Redirect URIs
In the "Authorized redirect URIs" section, add:
- `http://localhost:3000/` (for local development)
- `https://your-netlify-site.netlify.app/` (for production, replace with your actual Netlify URL)

### 6. Copy Your Credentials
- You'll see **Client ID** and **Client Secret**
- Copy the **Client ID** to `.env` file:
  ```env
  REACT_APP_GOOGLE_DRIVE_CLIENT_ID=your_copied_client_id
  ```

## How OAuth Flow Works

1. User clicks "Authorize Google Drive" button
2. Redirected to Google login/consent screen
3. User grants permission to access Google Drive
4. Redirected back to app with authorization code
5. Frontend exchanges code for access token via `/google-oauth-callback` endpoint
6. Access token stored in localStorage for future uploads/restores

## Testing Locally

### Step 1: Set up .env file
```bash
# Edit .env file in project root
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=your_client_id_from_google
REACT_APP_GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/
```

### Step 2: Restart React Development Server
```bash
# Kill the running server (Ctrl+C)
# Then restart it
npm start
```

### Step 3: Test the Feature
1. Navigate to Account page
2. Click "Authorize Google Drive"
3. Login to Google and grant permissions
4. You should see "Authorization successful" message
5. Now you can use Upload/Restore buttons

## Production (Netlify Deployment)

### Step 1: Add Environment Variables to Netlify
1. Go to your Netlify site dashboard
2. Go to **Site Settings → Build & Deploy → Environment**
3. Click **Edit variables**
4. Add these variables:
   - `GOOGLE_DRIVE_CLIENT_ID` (same Client ID as .env)
   - `GOOGLE_DRIVE_CLIENT_SECRET` (from Google Cloud Console)
   - `GOOGLE_DRIVE_REDIRECT_URI=https://your-site.netlify.app/`

### Step 2: Update Google Cloud Console
1. Go back to Google Cloud Console
2. Go to Credentials → OAuth client
3. Add to **Authorized redirect URIs**:
   - `https://your-site.netlify.app/`

### Step 3: Redeploy
Push your code to GitHub/your repo and Netlify will automatically deploy with the new environment variables.

## Troubleshooting

### Error: "Brakuje konfiguracji Google Drive" (Missing Google configuration)
**Solution**: 
- Check that `.env` file has `REACT_APP_GOOGLE_DRIVE_CLIENT_ID` with actual value (not empty)
- Restart React development server (`npm start`)
- Hard refresh browser (Ctrl+Shift+R)

### Error: "Failed to authorize Google Drive"
**Solution**:
- Verify Client ID is correct in `.env`
- Check that `REACT_APP_GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/` exactly matches Google Cloud Console settings
- No trailing slash differences!

### Error: "Failed to exchange authorization code"
**Solution** (for Netlify deployment):
- Check that `GOOGLE_DRIVE_CLIENT_SECRET` is set in Netlify environment
- Verify redirect URIs match in Google Cloud Console
- Redeploy the site

### CORS errors
**Solution**: Usually indicates redirect URI mismatch. 
- Local: must be `http://localhost:3000/`
- Production: must match your Netlify URL exactly

### Token not saving in localStorage
**Solution**:
- Open browser DevTools → Application → Local Storage
- Check if `google_drive_access_token` exists
- If not, retry authorization

## File Locations

- **Frontend config**: `.env` in project root
- **OAuth handler**: `netlify/functions/googleOAuthCallback.ts`
- **Component**: `src/features/AccountPage/BackupButtons/index.tsx`
- **API client**: `src/api/backupApi.ts`

