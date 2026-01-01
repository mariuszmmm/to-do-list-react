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

export const isTokenValid = (
  user: GoTrueUser | null | undefined,
  bufferMs: number = 60000
): boolean => {
  if (!user?.token?.expires_at) {
    return false;
  }

  const now = Date.now();
  const expiresAt = user.token.expires_at;

  return now < expiresAt - bufferMs;
};

export const getTokenExpiresIn = (
  user: GoTrueUser | null | undefined,
  now?: Date
): number => {
  if (!user?.token?.expires_at) {
    return 0;
  }
  const nowMs = now ? now.getTime() : Date.now();
  const remaining = user.token.expires_at - nowMs;
  return remaining > 0 ? remaining : 0;
};

export const getAccessToken = (
  user: GoTrueUser | null | undefined
): string | null => {
  return user?.token?.access_token || null;
};

export const isUserValid = (user: GoTrueUser | null | undefined): boolean => {
  return !!(user?.id && user?.email && user?.token);
};
