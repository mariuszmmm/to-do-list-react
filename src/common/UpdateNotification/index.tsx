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
    (registration: ServiceWorkerRegistration) => {
      // Blokada po-aktualizacyjna (10 sekund), aby uniknąć pętli
      const lastUpdate = sessionStorage.getItem("pwa_last_update_time");
      if (lastUpdate && Date.now() - parseInt(lastUpdate) < 10000) {
        return;
      }

      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowNotification(true);
        return;
      }

      if (registration.installing) {
        const worker = registration.installing;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed") {
            setWaitingWorker(worker);
            setShowNotification(true);
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
        registration.update().catch(() => {});
      }
    };

    init();
    const handleFocus = () => init();
    window.addEventListener("focus", handleFocus);

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.waiting) {
        setWaitingWorker(customEvent.detail.waiting);
        setShowNotification(true);
      }
    };
    window.addEventListener("sw-update-available", handleCustomEvent);

    return () => {
      window.removeEventListener("sw-update-available", handleCustomEvent);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkUpdateState]);

  const handleUpdate = async () => {
    setShowNotification(false);
    sessionStorage.setItem("pwa_updating", "true");
    sessionStorage.setItem("pwa_last_update_time", Date.now().toString());

    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }

    const sendSkipWaiting = () => {
      if (waitingWorker) {
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
      } else {
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
        });
      }
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
    accountMode === "login" ||
    accountMode === "accountSwitch" ||
    accountMode === "accountRegister"
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
