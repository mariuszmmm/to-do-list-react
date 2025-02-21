const confimationTokenKey = "confirmation_token" as const;
const recoveryTokenKey = "recovery_token" as const;

export const clearSessionStorage = () => sessionStorage.clear();

export const saveConfimationTokenInSessionStorage = (token: string) =>
  sessionStorage.setItem(confimationTokenKey, JSON.stringify(token));

export const getConfimationTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(confimationTokenKey);
  return data ? JSON.parse(data) : null;
};

export const saveRecoveryTokenFromSessionStorage = (token: string) =>
  sessionStorage.setItem(recoveryTokenKey, JSON.stringify(token));

export const getRecoveryTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(recoveryTokenKey);
  return data ? JSON.parse(data) : null;
};
