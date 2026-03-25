export async function exchangeGoogleOAuthCodeApi(code: string) {
  const response = await fetch("/auth-google-callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to exchange code: ${response.statusText}`,
    );
  }

  return response.json();
}

export async function refreshGoogleTokenApi(
  refreshToken: string,
  userToken: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const response = await fetch("/auth-google-refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to refresh token: ${response.statusText}`,
    );
  }

  return response.json();
}
