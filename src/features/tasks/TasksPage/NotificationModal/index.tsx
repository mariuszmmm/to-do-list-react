import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useAppDispatch,
  useAppSelector,
  useScheduleNotificationMutation,
  useScrollLock,
} from "../../../../hooks";
import {
  selectNotificationTask,
  setNotificationTask,
  selectTaskListMetaData,
} from "../../tasksSlice";
import { selectLoggedUserEmail } from "../../../AccountPage/accountSlice";
import { getUserToken } from "../../../../utils/auth/getUserToken";
import OneSignal from "react-onesignal";
import {
  ModalBackground,
  ModalContainer,
  ModalBody,
  ModalHeader,
  HeaderContent,
  ModalCancelButton,
} from "../../../../Modal/styled";
import {
  NotificationForm,
  Label,
  SaveButton,
  ButtonContainer,
  RelativeWrapper,
  FakeInput,
  HiddenDateInput,
} from "./styled";

const CalendarIconSVG = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.5 }}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const NotificationModal = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const task = useAppSelector(selectNotificationTask);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const [date, setDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scheduleNotification = useScheduleNotificationMutation();
  useScrollLock(!!task);

  const formatDisplayDate = (isoString: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";

      const formatter = new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
      return formatter.format(d);
    } catch (e) {
      return "";
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === "function") {
        try {
          inputRef.current.showPicker();
        } catch (error) {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (task) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 2);
      setDate(
        new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16),
      );
    }
  }, [task]);

  if (!task) return null;

  const handleClose = () => {
    dispatch(setNotificationTask(null));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      if (!loggedUserEmail) {
        alert(t("modal.notifications.notLoggedIn"));
        return;
      }

      if (!date) {
        return;
      }

      const selectedDate = new Date(date);
      const now = new Date();

      if (selectedDate <= now) {
        alert(
          t("modal.notifications.pastDateError") ||
            "Nie można zaplanować powiadomienia w przeszłości.",
        );
        return;
      }

      let subscriptionId = OneSignal.User?.PushSubscription?.id;

      if (!subscriptionId) {
        try {
          await OneSignal.Notifications.requestPermission();
          await new Promise<void>((resolve) => setTimeout(resolve, 1500));
          subscriptionId = OneSignal.User?.PushSubscription?.id || undefined;
        } catch (err) {
          console.warn("OneSignal permission failed:", err);
        }
      }

      if (!subscriptionId) {
        alert(
          t("modal.notifications.permissionBlocked") ||
            "Nie udało się uzyskać ID urządzenia. Upewnij się, że powiadomienia są włączone.",
        );
        return;
      }

      const currentToken = await getUserToken();
      
      // Dodatkowe sprawdzenia typów dla TypeScript
      if (!currentToken || !loggedUserEmail || !subscriptionId) {
        throw new Error("Missing required data for session or notification");
      }

      await scheduleNotification.mutateAsync({
        token: currentToken,
        payload: {
          taskId: task.id,
          content: task.content,
          date: new Date(date).toISOString(),
          userEmail: loggedUserEmail,
          subscriptionId: subscriptionId,
          heading: t("modal.notifications.label") || "",
          buttonText: t("modal.notifications.button") || "",
          listName: taskListMetaData.name || "",
          lang: i18n.language || "pl",
        },
      });

      handleClose();
    } catch (error: unknown) {
      console.error("[handleSubmit]", error);
      alert(
        t("modal.notifications.error") ||
          "Wystąpił błąd podczas planowania powiadomienia.",
      );
    }
  };

  return (
    <ModalBackground onClick={handleClose} $clickable>
      <ModalContainer>
        <ModalBody onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <HeaderContent>{t("modal.notifications.title")}</HeaderContent>
          </ModalHeader>
          <NotificationForm onSubmit={handleSubmit}>
            <p>
              {t("modal.notifications.taskContent")}:{" "}
              <strong>{task.content}</strong>
            </p>
            <Label>
              {t("modal.notifications.dateLabel")}
              <RelativeWrapper onClick={handleFocus}>
                <FakeInput>
                  <span>{formatDisplayDate(date)}</span>
                  <CalendarIconSVG />
                </FakeInput>
                <HiddenDateInput
                  ref={inputRef}
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </RelativeWrapper>
            </Label>
            <ButtonContainer>
              <ModalCancelButton
                type="button"
                onClick={handleClose}
                disabled={scheduleNotification.isPending}
              >
                {t("modal.buttons.cancelButton")}
              </ModalCancelButton>
              <SaveButton
                type="submit"
                disabled={scheduleNotification.isPending}
              >
                {scheduleNotification.isPending
                  ? t("tasksPage.form.buttons.loading")
                  : t("modal.notifications.confirm")}
              </SaveButton>
            </ButtonContainer>
          </NotificationForm>
        </ModalBody>
      </ModalContainer>
    </ModalBackground>
  );
};
