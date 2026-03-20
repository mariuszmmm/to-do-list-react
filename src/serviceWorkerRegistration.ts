/**
 * Ten plik odpowiada za rejestrację Service Workera, który umożliwia działanie aplikacji w trybie offline (PWA)
 * oraz obsługuje proces aktualizacji kodu aplikacji w przeglądarce użytkownika.
 */

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  // [::1] to adres localhost dla IPv6.
  window.location.hostname === "[::1]" ||
  // 127.0.0.0/8 to adresy localhost dla IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
  ),
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

/**
 * Funkcja inicjująca rejestrację Service Workera.
 * Sprawdza czy przeglądarka obsługuje SW i czy domena jest poprawna.
 */
export function register(config?: Config) {
  if ("serviceWorker" in navigator) {
    const publicUrl = new URL(
      process.env.PUBLIC_URL as string,
      window.location.href,
    );
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = "/service-worker.js";

      if (isLocalhost) {
        /**
         * Na localhost sprawdzamy, czy Service Worker w ogóle istnieje i czy jest poprawnym plikiem JS.
         */
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {});
      } else {
        /**
         * Na produkcji po prostu rejestrujemy Service Workera.
         */
        registerValidSW(swUrl, config);
      }
    });
  }
}

/**
 * Właściwa rejestracja poprawnego pliku Service Workera.
 */
function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      /**
       * Cykliczne sprawdzanie aktualizacji (co godzinę).
       * Dzięki temu aplikacja może wykryć nową wersję bez odświeżania strony przez użytkownika.
       */
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000,
      );

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              /**
               * NOWA WERSJA WYKRYTA:
               * Wyzwalamy zdarzenie systemowe, które komponenty React (np. UpdateNotification) 
               * mogą przechwycić, aby poinformować użytkownika o dostępności nowej wersji.
               */
              window.dispatchEvent(
                new CustomEvent("sw-update-available", {
                  detail: registration,
                }),
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              /**
               * Treść została zapisana w cache do działania offline.
               */
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

/**
 * Sprawdza czy Service Worker jest dostępny i czy jest poprawnym skryptem.
 * Jeśli nie (np. 404), wyrejestrowuje go i przeładowuje stronę.
 */
function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // Nie znaleziono SW - wyrejestruj i odśwież.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // SW istnieje, rejestrujemy normalnie.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode.",
      );
    });
}

/**
 * Usuwa rejestrację Service Workera.
 */
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
