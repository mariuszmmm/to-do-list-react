export const getGoogleOAuthUrl = (): string => {
  const clientId = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_DRIVE_REDIRECT_URI;
  const scope = "https://www.googleapis.com/auth/drive.file";

  if (!clientId || !redirectUri) {
    console.warn("Missing Google Drive configuration");
    return "";
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scope,
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};
