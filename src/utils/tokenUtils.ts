/**
 * Funkcje narzędziowe do zarządzania i walidacji tokenów autentykacji
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
 * Sprawdza czy token jest aktualnie ważny
 * @param user - Obiekt użytkownika GoTrue z localStorage
 * @param bufferMs - Bufor w milisekundach przed wygaśnięciem (domyślnie: 60s)
 * @returns true jeśli token jest ważny i nie wygasł
 */
export const isTokenValid = (
  user: GoTrueUser | null | undefined,
  bufferMs: number = 60000
): boolean => {
  if (!user?.token?.expires_at) {
    return false;
  }

  const now = Date.now();
  const expiresAt = user.token.expires_at;

  // Dodaj bufor aby zapobiec używaniu tokenów które są blisko wygaśnięcia
  return now < expiresAt - bufferMs;
};

/**
 * Zwraca pozostały czas do wygaśnięcia tokena
 * @param user - Obiekt użytkownika GoTrue z localStorage
 * @returns Pozostały czas w milisekundach, lub 0 jeśli wygasł/nieprawidłowy
 */
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

/**
 * Zwraca token dostępu z obiektu użytkownika
 * @param user - Obiekt użytkownika GoTrue z localStorage
 * @returns String tokena dostępu lub null
 */
export const getAccessToken = (
  user: GoTrueUser | null | undefined
): string | null => {
  return user?.token?.access_token || null;
};

/**
 * Sprawdza czy obiekt użytkownika istnieje i ma prawidłową strukturę
 * @param user - Obiekt użytkownika GoTrue z localStorage
 * @returns true jeśli obiekt użytkownika jest prawidłowy
 */
export const isUserValid = (user: GoTrueUser | null | undefined): boolean => {
  return !!(user?.id && user?.email && user?.token);
};
