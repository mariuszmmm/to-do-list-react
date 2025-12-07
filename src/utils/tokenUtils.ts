/**
 * Utility functions for managing and validating authentication tokens
 */

export interface TokenData {
  access_token?: string;
  expires_at?: number;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
}

export interface GoTrueUser {
  id?: string;
  email?: string;
  token?: TokenData;
  [key: string]: any;
}

/**
 * Checks if a token is currently valid
 * @param user - The GoTrue user object from localStorage
 * @param bufferMs - Buffer in milliseconds before expiration (default: 60s)
 * @returns true if token is valid and not expired
 */
export const isTokenValid = (user: GoTrueUser | null | undefined, bufferMs: number = 60000): boolean => {
  if (!user?.token?.expires_at) {
    return false;
  }

  const now = Date.now();
  const expiresAt = user.token.expires_at;
  
  // Add buffer to prevent using tokens that are about to expire
  return now < (expiresAt - bufferMs);
};

/**
 * Gets remaining time until token expires
 * @param user - The GoTrue user object from localStorage
 * @returns Remaining time in milliseconds, or 0 if expired/invalid
 */
export const getTokenExpiresIn = (user: GoTrueUser | null | undefined): number => {
  if (!user?.token?.expires_at) {
    return 0;
  }

  const remaining = user.token.expires_at - Date.now();
  return remaining > 0 ? remaining : 0;
};

/**
 * Gets the access token from user object
 * @param user - The GoTrue user object from localStorage
 * @returns Access token string or null
 */
export const getAccessToken = (user: GoTrueUser | null | undefined): string | null => {
  return user?.token?.access_token || null;
};

/**
 * Checks if user object exists and has valid structure
 * @param user - The GoTrue user object from localStorage
 * @returns true if user object is valid
 */
export const isUserValid = (user: GoTrueUser | null | undefined): boolean => {
  return !!(user?.id && user?.email && user?.token);
};
