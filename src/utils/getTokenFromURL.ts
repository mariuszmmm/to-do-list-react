import {
  saveConfimationTokenInSessionStorage,
  saveRecoveryTokenFromSessionStorage,
} from "./sessionStorage";

export const getTokenFromURL = (url: string) => {
  if (url.includes("#confirmation_token")) {
    const token = url.split("#confirmation_token=")[1];
    saveConfimationTokenInSessionStorage(token);
    const confirmationUrl = process.env.REACT_APP_CONFIRMATION_URL;
    if (confirmationUrl) window.location.href = confirmationUrl;
    return;
  }
  if (url.includes("#recovery_token")) {
    const token = url.split("#recovery_token=")[1];
    saveRecoveryTokenFromSessionStorage(token);
    const recoveryUrl = process.env.REACT_APP_RECOVERY_URL;
    if (recoveryUrl) window.location.href = recoveryUrl;
    return;
  }
};
