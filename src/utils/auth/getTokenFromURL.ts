import {
  saveConfimationTokenInSessionStorage,
  saveEmailChangeTokenInSessionStorage,
  saveInviteTokenInSessionStorage,
  saveRecoveryTokenInSessionStorage,
} from "../storage/sessionStorage";

export const handleAuthTokensFromUrl = () => {
  const url = window.location.href;
  const [, rawHash = ""] = url.split("#");
  const normalizedHash = rawHash.replace(/^\/?/, "");
  if (!normalizedHash) return;

  const params = new URLSearchParams(normalizedHash);

  const confirmationToken = params.get("confirmation_token");
  if (confirmationToken) {
    saveConfimationTokenInSessionStorage(confirmationToken);
    const confirmationUrl = process.env.REACT_APP_CONFIRMATION_URL;
    if (confirmationUrl) window.location.href = confirmationUrl;
    return;
  }

  const recoveryToken = params.get("recovery_token");
  if (recoveryToken) {
    saveRecoveryTokenInSessionStorage(recoveryToken);
    const recoveryUrl = process.env.REACT_APP_RECOVERY_URL;
    if (recoveryUrl) window.location.href = recoveryUrl;
    return;
  }

  const inviteToken = params.get("invite_token");
  if (inviteToken) {
    saveInviteTokenInSessionStorage(inviteToken);
    const inviteUrl = process.env.REACT_APP_INVITE_URL;
    if (inviteUrl) window.location.href = inviteUrl;
    return;
  }

  const emailChangeToken = params.get("email_change_token");
  if (emailChangeToken) {
    saveEmailChangeTokenInSessionStorage(emailChangeToken);
    window.location.href = "/#/";
  }
};
