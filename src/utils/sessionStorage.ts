const confimationTokenKey = "confirmation_token" as const;
const recoveryTokenKey = "recovery_token" as const;

export const getConfimationTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(confimationTokenKey);
  return data ? JSON.parse(data) : null;
};

export const getRecoveryTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(recoveryTokenKey);
  return data ? JSON.parse(data) : null;
};

export const saveConfimationTokenInSessionStorage = (token: string) =>
  localStorage.setItem(confimationTokenKey, JSON.stringify(token));

export const saveRecoveryTokenFromSessionStorage = (token: string) =>
  localStorage.setItem(recoveryTokenKey, JSON.stringify(token));
