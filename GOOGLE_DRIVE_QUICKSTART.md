# Quick Start - Google Drive Setup (5 minutes)

## Minimum Setup Required

To enable Google Drive backup you need: **Google Client ID**.

### Step 1: Create Client ID in Google Cloud Console (2 min)

1. Open https://console.cloud.google.com/
2. Click "Select a Project" → "NEW PROJECT"
3. Enter a name (e.g., "todo-backup"), click "CREATE"
4. Wait for the project to be ready
5. In the search bar type "Google Drive API" → click ENABLE
6. Go to "Credentials" in the left menu
7. Click "CREATE CREDENTIALS" → "OAuth client ID" → "Web application"
8. In "Authorized redirect URIs" add:
   - `http://localhost:3000/`
9. Click "CREATE"
10. **COPY the Client ID** (a long string)

### Step 2: Paste Client ID into .env (1 min)

**File**: `d:\dev\to-do-list-react\.env`

Change this line:
```env
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=
```

to:
```env
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=your_copied_client_id_here
```

### Step 3: Restart the app (2 min)

```bash
# In the terminal where the app is running:
# Press Ctrl+C to stop the server
# Then restart:
npm start
```

### Step 4: Test

1. Open http://localhost:3000/
2. Log in as admin
3. Go to Account page
4. Click "Authorize Google Drive"
5. Log in to Google
6. Grant permissions
7. You should see "Authorization successful"

## Done!

Now you can:
- ✅ Download backup to your computer
- ✅ Upload backup to Google Drive
- ✅ Restore backup from Google Drive

## If something doesn't work

- **"Missing Google Drive configuration"** → .env is missing Client ID
- **"Failed to authorize"** → Check if Client ID is correct
- **No response from Google** → Wait, sometimes Google Drive API needs a moment

## Deployment on Netlify

When you're ready to deploy:
1. In Google Cloud Console add to redirect URIs: `https://your-domain.netlify.app/`
2. In Netlify dashboard add env variables (see GOOGLE_DRIVE_SETUP.md)
3. Push to git
4. Netlify will deploy automatically
