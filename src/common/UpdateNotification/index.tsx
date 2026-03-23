import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/redux/redux";
import { selectAccountMode } from "../../features/AccountPage/accountSlice";
import { NotificationWrapper, Message, UpdateButton } from "./styled";

export const UpdateNotification = () => {
  const { t } = useTranslation();
  const [showNotification, setShowNotification] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  // Tryb konta (login, logged, itp.)
  const accountMode = useAppSelector(selectAccountMode);

  const checkUpdateState = useCallback(
    async (registration: ServiceWorkerRegistration) => {
      // Funkcja cichego omijania "Phantom Updates" (fałszywych aktualizacji widmo z CDN)
      const trySilentlySkip = async (waitingWorker: ServiceWorker) => {
        const getWorkerVersion = (
          worker: ServiceWorker,
        ): Promise<string | null> => {
          return new Promise((resolve) => {
            if (worker.state === "redundant") return resolve(null);
            const handler = (event: MessageEvent) => {
              if (event.data && event.data.type === "VERSION_INFO") {
                navigator.serviceWorker.removeEventListener("message", handler);
                resolve(event.data.version);
              }
            };
            navigator.serviceWorker.addEventListener("message", handler);
            worker.postMessage({ type: "GET_VERSION" });
            setTimeout(() => {
              navigator.serviceWorker.removeEventListener("message", handler);
              resolve(null);
            }, 1000); // Wydłużony timeout (1s) dla urządzeń mobilnych
          });
        };

        const activeWorker = registration.active;
        if (activeWorker && waitingWorker) {
          const activeVersion = await getWorkerVersion(activeWorker);
          const waitingVersion = await getWorkerVersion(waitingWorker);
          if (
            activeVersion &&
            waitingVersion &&
            activeVersion === waitingVersion
          ) {
            // Unikalny timestamp na serwerze nie uległ zmianie (ten sam kod źródłowy).
            // Jest to fałszywy alarm wygenerowany przez przeglądarkę i cache. Odrzucamy cicho!
            waitingWorker.postMessage({ type: "SKIP_WAITING" });
            return true;
          }
        }
        return false;
      };

      if (registration.waiting) {
        const isPhantom = await trySilentlySkip(registration.waiting);
        if (!isPhantom) {
          setWaitingWorker(registration.waiting);
          setShowNotification(true);
        }
        return;
      }

      if (registration.installing) {
        const worker = registration.installing;
        worker.addEventListener("statechange", async () => {
          if (worker.state === "installed") {
            const isPhantom = await trySilentlySkip(worker);
            if (!isPhantom) {
              setWaitingWorker(worker);
              setShowNotification(true);
            }
          }
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const init = async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        checkUpdateState(registration);
        registration.onupdatefound = () => checkUpdateState(registration);
      }
    };

    init();

    // Dodatkowe, agresywne sprawdzanie aktualizacji przy powrocie użytkownika do aplikacji
    const handleRevisit = async () => {
      if (document.visibilityState === "visible") {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
          checkUpdateState(reg);
        }
      }
    };

    const handleCustomEvent = async (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        checkUpdateState(customEvent.detail); // Przekazujemy całą rejestrację upewniając się że fałszywe powiadomienia są zbijane
      }
    };

    window.addEventListener("sw-update-available", handleCustomEvent);
    document.addEventListener("visibilitychange", handleRevisit);
    window.addEventListener("focus", handleRevisit);

    return () => {
      window.removeEventListener("sw-update-available", handleCustomEvent);
      document.removeEventListener("visibilitychange", handleRevisit);
      window.removeEventListener("focus", handleRevisit);
    };
  }, [checkUpdateState]);

  const handleUpdate = async () => {
    setShowNotification(false);
    sessionStorage.setItem("pwa_updating", "true");

    try {
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
    } catch (error) {
      console.warn("UpdateNotification: Failed to clear caches", error);
    }

    const sendSkipWaiting = () => {
      if (waitingWorker && waitingWorker.state !== "redundant") {
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
      }

      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        }
      });
    };

    sendSkipWaiting();
    const interval = setInterval(sendSkipWaiting, 200);
    setTimeout(() => clearInterval(interval), 1000);

    let refreshing = false;
    const controllerChangeHandler = () => {
      if (!refreshing && sessionStorage.getItem("pwa_updating")) {
        refreshing = true;
        sessionStorage.removeItem("pwa_updating");
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      controllerChangeHandler,
    );

    setTimeout(() => {
      if (!refreshing && sessionStorage.getItem("pwa_updating")) {
        refreshing = true;
        sessionStorage.removeItem("pwa_updating");
        window.location.reload();
      }
    }, 2000);
  };

  // UKRYWAMY POWIADOMIENIE w trybie logowania i przełączania kont
  // Zapobiega to pokazywaniu paska, gdy użytkownik jest w trakcie zmiany sesji
  if (
    !showNotification ||
    accountMode === "accountSwitch"
  ) {
    return null;
  }

  // Zabezpieczenie przed pokazywaniem podczas przełączania konta (flaga w sessionStorage)
  if (sessionStorage.getItem("account_switch_target")) {
    return null;
  }

  return (
    <NotificationWrapper>
      <Message>{t("updateNotification.message") as string}</Message>
      <UpdateButton onClick={handleUpdate}>
        {t("updateNotification.button") as string}
      </UpdateButton>
    </NotificationWrapper>
  );
};
