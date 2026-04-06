import React, { useEffect, useState, useCallback, useRef } from "react";
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

  // Ref do trzymania informacji o trwającym przeładowaniu, by uniknąć zapętleń
  const isRefreshing = useRef(false);

  const checkUpdateState = useCallback(
    async (registration: ServiceWorkerRegistration) => {
      // Funkcja omijania "Phantom Updates" (puste aktualizacje bez zmiany kodu)
      const trySilentlySkip = async (worker: ServiceWorker) => {
        const getWorkerVersion = (
          sw: ServiceWorker,
          label: string,
        ): Promise<string | null> => {
          return new Promise((resolve) => {
            if (sw.state === "redundant") return resolve(null);
            
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              if (event.data && event.data.type === "VERSION_INFO") {
                resolve(event.data.version);
              }
            };
            
            sw.postMessage({ type: "GET_VERSION" }, [messageChannel.port2]);
            
            // Timeout 2s dla większej niezawodności w desktopowych przeglądarkach
            setTimeout(() => {
              resolve(null);
            }, 2000);
          });
        };

        const activeWorker = registration.active;
        if (activeWorker && worker && activeWorker !== worker) {
          const activeVersion = await getWorkerVersion(activeWorker, "ActiveWorker");
          const waitingVersion = await getWorkerVersion(worker, "NewWorker");
          
          if (
            activeVersion &&
            waitingVersion &&
            activeVersion === waitingVersion
          ) {
            console.log("[UpdateNotification] Wykryto Phantom Update (wersje identyczne). Omijanie...");
            worker.postMessage({ type: "SKIP_WAITING" });
            return true;
          }
        }
        return false;
      };

      if (registration.waiting) {
        const isPhantom = await trySilentlySkip(registration.waiting);
        if (!isPhantom) {
          console.log("[UpdateNotification] Wykryto REALNĄ aktualizację. Pokazuję powiadomienie.");
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
              console.log("[UpdateNotification] Nowy SW zainstalowany. Pokazuję powiadomienie.");
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
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          checkUpdateState(registration);
          
          // Upewniamy się, że nie nadpisujemy ważnych listenerów, ale reagujemy na nowe
          const originalOnUpdateFound = registration.onupdatefound;
          registration.onupdatefound = (ev: Event) => {
            checkUpdateState(registration);
            if (typeof originalOnUpdateFound === "function") {
              originalOnUpdateFound.call(registration, ev);
            }
          };
        }
      } catch (err) {
        console.error("[UpdateNotification] Błąd podczas pobierania rejestracji SW:", err);
      }
    };

    init();

    // Reagujemy na zdarzenie z serviceWorkerRegistration.ts (jeśli tamto zadziała pierwsze)
    const handleCustomEvent = async (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        checkUpdateState(customEvent.detail);
      }
    };

    // Obsługa przeładowania przy zmianie kontrolera (np. gdy inna karta kliknie "Aktualizuj")
    const handleControllerChange = () => {
      console.log("[UpdateNotification] Wykryto zmianę kontrolera (controllerchange).");
      if (!isRefreshing.current && localStorage.getItem("pwa_updating_global")) {
        console.log("[UpdateNotification] Wykryto flagę aktualizacji. Przeładowuję stronę...");
        isRefreshing.current = true;
        localStorage.removeItem("pwa_updating_global");
        window.location.reload();
      }
    };

    // Agresywne sprawdzanie przy powrocie użytkownika
    const handleRevisit = async () => {
      if (document.visibilityState === "visible") {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          try {
            await reg.update();
            checkUpdateState(reg);
          } catch (e) {
            console.warn("[UpdateNotification] Nie udało się wymusić aktualizacji:", e);
          }
        }
      }
    };

    window.addEventListener("sw-update-available", handleCustomEvent);
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    document.addEventListener("visibilitychange", handleRevisit);
    window.addEventListener("focus", handleRevisit);

    return () => {
      window.removeEventListener("sw-update-available", handleCustomEvent);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      document.removeEventListener("visibilitychange", handleRevisit);
      window.removeEventListener("focus", handleRevisit);
    };
  }, [checkUpdateState]);

  const handleUpdate = async () => {
    console.log("[UpdateNotification] Użytkownik kliknął Aktualizuj.");
    setShowNotification(false);
    
    // Używamy localStorage zamiast sessionStorage, aby inne karty też wiedziały że mogą się przeładować
    localStorage.setItem("pwa_updating_global", "true");

    try {
      if ("caches" in window) {
        console.log("[UpdateNotification] Czyszczenie cache...");
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
    } catch (error) {
      console.warn("[UpdateNotification] Błąd czyszczenia cache:", error);
    }

    const sendSkipWaiting = () => {
      if (waitingWorker && waitingWorker.state !== "redundant") {
        console.log("[UpdateNotification] Wysyłanie SKIP_WAITING do waitingWorker.");
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
      }

      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          if (reg.waiting) {
            console.log("[UpdateNotification] Wysyłanie SKIP_WAITING do zlokalizowanej rejestracji waiting.");
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        }
      });
    };

    sendSkipWaiting();
    // Powtarzamy kilka razy, by upewnić się że dotarło do opornych workerów
    const interval = setInterval(sendSkipWaiting, 300);
    setTimeout(() => clearInterval(interval), 1500);

    // Awaryjny reload po 3 sekundach, jeśli controllerchange nie odpalił
    setTimeout(() => {
      if (!isRefreshing.current) {
        console.log("[UpdateNotification] Awaryjne przeładowanie (brak controllerchange).");
        isRefreshing.current = true;
        localStorage.removeItem("pwa_updating_global");
        window.location.reload();
      }
    }, 4000);
  };

  // UKRYWAMY POWIADOMIENIE w trybie logowania i przełączania kont
  if (
    !showNotification ||
    accountMode === "accountSwitch" ||
    sessionStorage.getItem("account_switch_target")
  ) {
    return null;
  }

  return (
    <NotificationWrapper id="pwa-update-bar">
      <Message>{t("updateNotification.message") as string}</Message>
      <UpdateButton onClick={handleUpdate}>
        {t("updateNotification.button") as string}
      </UpdateButton>
    </NotificationWrapper>
  );
};
