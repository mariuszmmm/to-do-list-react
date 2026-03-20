import { useEffect } from "react";
import OneSignal from "react-onesignal";

/**
 * Komponent NotificationManager odpowiada za niskopoziomową inicjalizację SDK OneSignal.
 * Jest on kluczowy dla poprawnego działania powiadomień Push, szczególnie w przeglądarce Edge
 * i w scenariuszach PWA, gdzie mogą występować konflikty między skryptami Service Workera.
 */
export const NotificationManager = () => {
  useEffect(() => {
    const appId = process.env.REACT_APP_ONESIGNAL_APP_ID;
    if (!appId) return;

    const setup = async () => {
      try {
        /**
         * 1. Rozwiązywanie problemów z Service Workerami (np. w Edge).
         * Jeśli w przeglądarce 'wiszą' stare lub niekompatybilne rejestracje SW,
         * wyrejestrowujemy je wszystkie, aby przygotować czysty grunt pod nową instalację.
         */
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          const mainWorkerUrl = "/service-worker.js";
          
          // Szukamy, czy nasz główny worker jest już zarejestrowany
          const existingMain = regs.find(r => r.active?.scriptURL.endsWith(mainWorkerUrl));

          if (!existingMain) {
            // Jeśli nie ma naszego workera, ale są inne (np. stare od OneSignal), czyścimy je
            for (const reg of regs) {
              await reg.unregister();
            }

            await navigator.serviceWorker.register(mainWorkerUrl, {
              scope: "/",
            });
          }
        }

        /**
         * 3. Inicjalizacja OneSignal SDK.
         * Konfigurujemy SDK tak, aby współdzieliło ten sam plik Service Workera,
         * co pozwala uniknąć konfliktów przy odświeżaniu i w trybie offline.
         */
        await OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true, // Pozwala na testowanie powiadomień na localhost
          serviceWorkerPath: "service-worker.js",
          notificationServiceWorkerPath: "service-worker.js",
          serviceWorkerRegistration: {
            /**
             * completeRegistration: true - Bardzo ważna flaga. Mówimy SDK, że sami
             * obsłużyliśmy rejestrację Service Workera i nie musi ono próbować robić tego ponownie.
             */
            completeRegistration: true,
          },
        });

      } catch (err) {
        console.error("OneSignal: Setup failed", err);
      }
    };

    setup();
  }, []);

  // Komponent nie renderuje nic w UI, służy jedynie jako zarządca logiki startowej.
  return null;
};
