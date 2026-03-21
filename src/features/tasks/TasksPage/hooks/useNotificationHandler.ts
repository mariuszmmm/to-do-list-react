import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../hooks/redux/redux";
import OneSignal from "react-onesignal";
import { setNotificationTask } from "../../tasksSlice";
import { Task } from "../../../../types";

/**
 * Hook obsługujący logikę kliknięcia w przycisk powiadomień dla konkretnego zadania.
 * Zajmuje się sprawdzaniem uprawnień, inicjalizacją subskrypcji OneSignal
 * oraz otwieraniem modala planowania powiadomienia.
 */
export const useNotificationHandler = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleNotificationClick = async (task: Task) => {
    try {
      // 1. Sprawdzanie uprawnień (przed promptem)
      if (Notification.permission === "denied") {
        alert(t("modal.notifications.permissionBlocked"));
        return;
      }

      // 2. Obsługa subskrypcji OneSignal
      if (window.isSecureContext) {
        let isOptedIn = OneSignal.User.PushSubscription.optedIn;

        if (!isOptedIn) {
          await (OneSignal.Slidedown as any).promptPush({ force: true });

          let checks = 0;
          while (checks < 20) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (OneSignal.User.PushSubscription.optedIn) {
              isOptedIn = true;
              break;
            }
            checks++;
          }
        }

        dispatch(setNotificationTask(task));
      } else {
        dispatch(setNotificationTask(task));
      }
    } catch (e) {
      console.warn("OneSignal notification click error:", e);
      dispatch(setNotificationTask(task));
    }
  };

  return { handleNotificationClick };
};
