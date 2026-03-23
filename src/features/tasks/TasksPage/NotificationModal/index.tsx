import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  useAppDispatch,
  useAppSelector,
  useScheduleNotificationMutation,
  useUpdateNotificationMutation,
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
} from "../../../../Modal/styled";
import { useQueryClient } from "@tanstack/react-query";
import {
  useScheduledNotificationsQuery,
  ScheduledNotification,
} from "../../../../hooks/queries/useScheduledNotificationsQuery";
import { useCancelNotificationMutation } from "../../../../hooks/mutations/useCancelNotificationMutation";
import {
  NotificationForm,
  Label,
  SaveButton,
  ButtonContainer,
  RelativeWrapper,
  FakeInput,
  HiddenDateInput,
  ScheduledList,
  ScheduledItem,
  ModalCancelButtonUnified,
  ScheduledHeaderWrapper,
  ScheduledHeader,
  CounterBadge,
  ScheduledHeaderRow,
  ScheduledInfo,
  ScheduledDate,
  ScheduledText,
  ScheduledListName,
  ScheduledUserEmail,
} from "./styled";
import { RemoveButton, EditButton } from "../../../../common/taskButtons";
import { RefreshButton } from "../../../../common/RefreshButton";

/**
 * Ikona kalendarza używana w polu daty oraz na liście zaplanowanych powiadomień.
 */
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

/**
 * Komponent NotificationModal odpowiada za:
 * 1. Wybór daty i godziny powiadomienia dla wybranego zadania.
 * 2. Wysyłanie żądania zaplanowania powiadomienia do serwera (Netlify Function).
 * 3. Wyświetlanie listy już zaplanowanych powiadomień dla danego użytkownika (Master ID).
 * 4. Anulowanie istniejących powiadomień.
 */
export const NotificationModal = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const task = useAppSelector(selectNotificationTask);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const [date, setDate] = useState("");
  const [isActionPending, setIsActionPending] = useState(false);
  const [editingNotificationId, setEditingNotificationId] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pobieranie listy zaplanowanych powiadomień przy użyciu React Query
  const {
    data: scheduledNotifications,
    isLoading: isListLoading,
    isError: isListError,
    refetch,
    isFetching,
  } = useScheduledNotificationsQuery();

  const queryClient = useQueryClient();
  const scheduleNotification = useScheduleNotificationMutation();
  const updateNotification = useUpdateNotificationMutation();
  const cancelNotification = useCancelNotificationMutation();

  // Blokujemy przewijanie tła, gdy modal jest otwarty
  useScrollLock(!!task);

  /**
   * Automatyczne odświeżanie listy zaplanowanych powiadomień co minutę (10 sekund po pełnej minucie).
   * Jest to ważne, ponieważ powiadomienia "znikają" z listy serwerowej po ich wysłaniu.
   */
  useEffect(() => {
    if (!task) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextRefresh = () => {
      const now = new Date();
      const nextRefresh = new Date(now);

      nextRefresh.setSeconds(10);
      nextRefresh.setMilliseconds(0);

      if (nextRefresh <= now) {
        nextRefresh.setMinutes(nextRefresh.getMinutes() + 1);
      }

      const delay = nextRefresh.getTime() - now.getTime();

      timeoutId = setTimeout(() => {
        refetch();
        scheduleNextRefresh();
      }, delay);
    };

    scheduleNextRefresh();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [task, refetch]);

  /**
   * Formatuje datę do czytelnej postaci (np. "12 marca 2024 • 14:00").
   * Obsługuje lokalizację (pl/en).
   */
  const formatDisplayDate = (dateVal: string | number | undefined) => {
    if (!dateVal) return "";
    try {
      const d =
        typeof dateVal === "number"
          ? new Date(dateVal * 1000)
          : new Date(dateVal);
      if (isNaN(d.getTime())) return "";

      const locale = i18n.language?.startsWith("pl") ? "pl-PL" : "en-US";

      const datePart = new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);

      const timePart = new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);

      return `${datePart} • ${timePart}`;
    } catch (e) {
      return "";
    }
  };

  /**
   * Przygotowuje datę dla inputa typu 'datetime-local'.
   */
  const formatInputDate = (isoString: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  /**
   * Obsługuje fokus na ukrytym inpucie daty, otwierając natywny picker systemowy.
   */
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

  // Ustawienie domyślnej daty (2 minuty od teraz) po otwarciu modala
  useEffect(() => {
    if (task) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      setDate(formatInputDate(now.toISOString()));
    }
  }, [task]);

  if (!task) return null;

  // Skracamy treść zadania do 300 znaków (obliczane po sprawdzeniu czy task istnieje)
  const truncatedTaskContent =
    task.content.length > 300
      ? task.content.slice(0, 300) + "..."
      : task.content;

  const handleClose = () => {
    dispatch(setNotificationTask(null));
  };

  const handleCancelClick = () => {
    if (editingNotificationId) {
      setEditingNotificationId(null);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      setDate(formatInputDate(now.toISOString()));
    } else {
      handleClose();
    }
  };

  const handleEditNotification = (notif: ScheduledNotification) => {
    setEditingNotificationId(notif.id);
    const dateVal = notif.send_after;
    const d =
      typeof dateVal === "number"
        ? new Date(dateVal * 1000)
        : new Date(dateVal);
    setDate(formatInputDate(d.toISOString()));
  };

  /**
   * Anuluje zaplanowane powiadomienie.
   * Wykorzystuje optymistyczną aktualizację interfejsu (React Query).
   */
  const handleDeleteNotification = async (id: string) => {
    if (window.confirm(t("modal.notifications.confirmDelete"))) {
      // Optymistyczna aktualizacja: używamy adresu e-mail jako klucza zapytania
      queryClient.setQueryData<ScheduledNotification[]>(
        ["scheduledNotifications", loggedUserEmail],
        (old) => old?.filter((n) => n.id !== id) || [],
      );

      setIsActionPending(true);
      try {
        await cancelNotification.mutateAsync(id);
        // Odświeżamy listę i czekamy na wynik
        await refetch();
      } catch (err) {
        console.error("Delete notification error:", err);
        // W razie błędu przywracamy listę z serwera
        await refetch();
      } finally {
        setIsActionPending(false);
      }
    }
  };

  /**
   * Obsługa formularza planowania powiadomienia.
   */
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      if (!loggedUserEmail) {
        alert(t("modal.notifications.notLoggedIn"));
        return;
      }

      const selectedDate = new Date(date);
      const now = new Date();

      if (selectedDate <= now) {
        alert(t("modal.notifications.pastDateError"));
        return;
      }

      // Pobranie Subscription ID z OneSignal
      let subscriptionId = OneSignal.User?.PushSubscription?.id;

      // Jeśli nie ma subskrypcji, prosimy o uprawnienia
      if (!subscriptionId) {
        try {
          await OneSignal.Notifications.requestPermission();
          subscriptionId = OneSignal.User?.PushSubscription?.id; // Spróbuj pobrać ponownie po prośbie
        } catch (err) {
          console.warn("OneSignal permission failed:", err);
        }
      }

      if (!subscriptionId) {
        alert(t("modal.notifications.permissionBlocked"));
        return;
      }

      const currentToken = await getUserToken();
      if (!currentToken) throw new Error("Missing auth token");

      setIsActionPending(true);

      if (editingNotificationId) {
        await updateNotification.mutateAsync({
          token: currentToken,
          payload: {
            id: editingNotificationId,
            date: new Date(selectedDate).toISOString(),
          },
        });
        setEditingNotificationId(null);
      } else {
        /**
         * Wywołanie mutacji planującej powiadomienie (wysłanie do Netlify Functions).
         */
        await scheduleNotification.mutateAsync({
          token: currentToken,
          payload: {
            taskId: task.id,
            content: truncatedTaskContent,
            date: new Date(selectedDate).toISOString(),
            userEmail: loggedUserEmail,
            subscriptionId: subscriptionId,
            heading: t("modal.notifications.label"),
            buttonText: t("modal.notifications.button"),
            listName: taskListMetaData.name || "",
            lang: i18n.language || "pl",
            displayImage: task.image?.imageUrl || null,
          },
        });
      }

      // Odświeżenie listy natychmiast po sukcesie - czekamy na finish
      await refetch();
    } catch (error) {
      console.error("[handleSubmit]", error);
      alert(t("modal.notifications.error"));
    } finally {
      setIsActionPending(false);
    }
  };

  return (
    <ModalBackground onClick={handleClose} $clickable>
      <ModalContainer>
        <ModalBody onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <HeaderContent>
              {editingNotificationId
                ? t("modal.notifications.editTooltip")
                : t("modal.notifications.title")}
            </HeaderContent>
          </ModalHeader>

          {/* Formularz planowania nowej notyfikacji */}
          <NotificationForm onSubmit={handleSubmit}>
            <p>
              {t("modal.notifications.taskContent")}:{" "}
              <strong>{truncatedTaskContent}</strong>
            </p>
            <Label>
              {editingNotificationId ? (
                <span style={{ color: "#f6a800", fontWeight: "bold" }}>
                  ✏️ {t("modal.notifications.editTooltip")}
                </span>
              ) : (
                t("modal.notifications.dateLabel")
              )}
              <RelativeWrapper onClick={handleFocus}>
                <FakeInput>
                  {formatDisplayDate(date)}
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
              <ModalCancelButtonUnified
                type="button"
                onClick={handleCancelClick}
                disabled={isActionPending}
              >
                {editingNotificationId
                  ? t("modal.buttons.cancelEdit")
                  : t("modal.buttons.cancelButton")}
              </ModalCancelButtonUnified>
              <SaveButton type="submit" disabled={isActionPending}>
                {isActionPending
                  ? t("tasksPage.form.buttons.loading")
                  : editingNotificationId
                    ? t("modal.notifications.confirmUpdate")
                    : t("modal.notifications.confirm")}
              </SaveButton>
            </ButtonContainer>
          </NotificationForm>

          {/* Lista już zaplanowanych powiadomień */}
          <ScheduledList>
            <ScheduledHeaderWrapper>
              <ScheduledHeader>
                <span>{t("modal.notifications.scheduledTitle")}</span>
                {scheduledNotifications &&
                  scheduledNotifications.length > 0 && (
                    <CounterBadge>{scheduledNotifications.length}</CounterBadge>
                  )}
              </ScheduledHeader>
              <RefreshButton
                onClick={() => refetch()}
                isLoading={isListLoading || isFetching}
              >
                {isFetching
                  ? t("modal.notifications.loading")
                  : t("modal.notifications.refresh")}
              </RefreshButton>
            </ScheduledHeaderWrapper>

            {isListLoading && <p>{t("modal.notifications.loading")}</p>}

            {isListError && (
              <p style={{ color: "red" }}>
                {t("modal.notifications.fetchError")}
              </p>
            )}

            {!isListLoading &&
              !isListError &&
              (!scheduledNotifications ||
                scheduledNotifications.length === 0) && (
                <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>
                  {t("modal.notifications.noScheduled")}
                </p>
              )}

            {scheduledNotifications &&
              [...scheduledNotifications]
                .sort((a, b) => {
                  const timeA =
                    typeof a.send_after === "number"
                      ? a.send_after * 1000
                      : new Date(a.send_after).getTime();
                  const timeB =
                    typeof b.send_after === "number"
                      ? b.send_after * 1000
                      : new Date(b.send_after).getTime();
                  return timeA - timeB;
                })
                .map((notif) => (
                  <ScheduledNotificationItem
                    key={notif.id}
                    notif={notif}
                    formatDisplayDate={formatDisplayDate}
                    handleDeleteNotification={handleDeleteNotification}
                    handleEditNotification={handleEditNotification}
                    cancelPending={cancelNotification.isPending}
                    isActionPending={isActionPending}
                    isEditing={notif.id === editingNotificationId}
                    isEditMode={!!editingNotificationId}
                    isDimmed={
                      !!editingNotificationId &&
                      editingNotificationId !== notif.id
                    }
                    t={t}
                  />
                ))}
          </ScheduledList>
        </ModalBody>
      </ModalContainer>
    </ModalBackground>
  );
};

const LocalEditBadge = styled.div`
  position: absolute;
  top: -8px;
  right: 12px;
  background: ${({ theme }) => theme.colors.info.value2};
  color: ${({ theme }) => theme.colors.button.primaryText};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
  pointer-events: none;
`;

const ScheduledNotificationItem = ({
  notif,
  formatDisplayDate,
  handleDeleteNotification,
  handleEditNotification,
  cancelPending,
  isActionPending,
  isEditing,
  isEditMode,
  isDimmed,
  t,
}: {
  notif: ScheduledNotification;
  formatDisplayDate: (d: any) => string;
  handleDeleteNotification: (id: string) => Promise<void>;
  handleEditNotification: (notif: ScheduledNotification) => void;
  cancelPending: boolean;
  isActionPending: boolean;
  isEditing: boolean;
  isEditMode: boolean;
  isDimmed: boolean;
  t: any;
}) => {
  const content = notif.content || "";
  const displayedContent =
    content.length > 300 ? content.slice(0, 300) + "..." : content;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <ScheduledItem
      $isHovered={isHovered}
      $isEditing={isEditing}
      $isDimmed={isDimmed}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {isEditing && (
        <LocalEditBadge>
          ✏️ {t("modal.notifications.confirmUpdate")}
        </LocalEditBadge>
      )}
      <ScheduledHeaderRow>
        <ScheduledInfo>
          <ScheduledDate>
            <CalendarIconSVG />
            {formatDisplayDate(notif.send_after)}
          </ScheduledDate>
          {notif.data?.userEmail && (
            <ScheduledUserEmail>{notif.data.userEmail}</ScheduledUserEmail>
          )}
          <ScheduledListName>
            {notif.data?.listName || t("modal.notifications.listLabel")}
          </ScheduledListName>
        </ScheduledInfo>
        <div style={{ display: "flex", gap: "8px" }}>
          <EditButton
            type="button"
            onClick={() => handleEditNotification(notif)}
            disabled={cancelPending || isActionPending || isEditMode}
            title={t("modal.notifications.editTooltip")}
          >
            ✏️
          </EditButton>
          <RemoveButton
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              setIsHovered(false);
              await handleDeleteNotification(notif.id);
            }}
            disabled={cancelPending || isActionPending || isEditMode}
            title={t("modal.notifications.cancelTooltip")}
          >
            🗑️
          </RemoveButton>
        </div>
      </ScheduledHeaderRow>
      <ScheduledText>{displayedContent}</ScheduledText>
    </ScheduledItem>
  );
};
