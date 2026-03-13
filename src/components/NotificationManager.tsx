import { useEffect } from "react";
import OneSignal from "react-onesignal";

export const NotificationManager = () => {
  useEffect(() => {
    const appId = process.env.REACT_APP_ONESIGNAL_APP_ID;
    if (!appId) return;

    OneSignal.init({
      appId,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerPath: "service-worker.js",
      serviceWorkerParam: { scope: "/" },
    })
      .then(() => {
        console.log("OneSignal [react-onesignal v16] załadowany pomyślnie!");
      })
      .catch((err) => {
        if (err?.message?.includes("already initialized")) return;
        console.warn("OneSignal initialization failed", err);
      });
  }, []);

  return null;
};
