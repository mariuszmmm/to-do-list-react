/**
 * Klucze używane w LocalStorage do przechowywania stanu technicznego powiadomień.
 */
const PUSH_INITIALIZED_KEY = "push_initialized";

/**
 * DIAGNOSTYKA/NAPRAWA: Pomocnik do konsoli (F12) oraz przycisku Resetu.
 * Pozwala na siłowy reset całego lokalnego środowiska powiadomień.
 */
export const resetNotifications = async () => {
  try {
    // 1. Wyrejestrowanie Service Workerów
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // 2. Czyszczenie Cache Storage
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    // 3. Usuwanie baz IndexedDB OneSignal
    let dbNames: string[] = [
      "OneSignalSDKDatabase",
      "OneSignalSDKIndices",
      "OneSignal",
      "onesignal",
    ];
    for (const dbName of dbNames) {
      const request = indexedDB.deleteDatabase(dbName);
      await new Promise<void>((resolve) => {
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        setTimeout(resolve, 2000);
      });
    }

    // 4. Czyszczenie Local i Session Storage
    [localStorage, sessionStorage].forEach((storage) => {
      Object.keys(storage).forEach((key) => {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("onesignal") ||
          key === PUSH_INITIALIZED_KEY ||
          key === "pwa_last_update_time" ||
          key === "pwa_updating" ||
          key === "account_switch_target"
        ) {
          storage.removeItem(key);
        }
      });
    });

    // 5. Czyszczenie ciasteczek SDK
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name.toLowerCase().includes("onesignal")) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      }
    });
  } catch (err) {
    console.error("NotificationSystem: Cleanup error:", err);
  }
};
