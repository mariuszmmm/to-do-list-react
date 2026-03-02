import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { StyledSpan, AnimatedSpan } from "../../common/StyledList";
import { CollapseButton, CollapseIcon } from "../../common/CollapseButton";
import { AccountActions } from "./AccountActions";
import { AccountForm } from "./AccountForm";
import { AccountFormActions } from "./AccountFormActions";
import { BackupManager } from "./BackupManager";
import { SystemAdmin } from "./SystemAdmin";
import { PresenceUsersList } from "./PresenceUsersList";
import { SessionInfo } from "./SessionInfo";
import { Settings } from "../../types";
import {
  selectAllDevicesCount,
  selectLoggedUserEmail,
  selectLoggedUserName,
  selectIsAdmin,
  selectTotalUsersCount,
  selectUserDevicesCount,
} from "./accountSlice";
import { getSystemStatusApi } from "../../api/backupApi";
import { openModal } from "../../Modal/modalSlice";
import { getUserToken } from "../../utils/auth/getUserToken";
import { useTranslation } from "react-i18next";
import { NameContainer } from "../tasks/TasksPage/EditableListName/styled";
import {
  getSettingsFromLocalStorage,
  saveSettingsInLocalStorage,
} from "../../utils/storage/localStorage";
import { AccountAvatar, getAvatarColor } from "./AccountSwitcher/styled";
import styled from "styled-components";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmailText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const loggedUserName = useAppSelector(selectLoggedUserName);
  const isAdmin = useAppSelector(selectIsAdmin);
  const userDevices = useAppSelector(selectUserDevicesCount);
  const totalUsersCount = useAppSelector(selectTotalUsersCount);
  const allDevicesCount = useAppSelector(selectAllDevicesCount);

  const avatarBgColor = loggedUserEmail ? getAvatarColor(loggedUserEmail) : "";
  const initial = loggedUserEmail
    ? (loggedUserName || loggedUserEmail)[0].toUpperCase()
    : "";
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const [isBackupOpen, setIsBackupOpen] = useState(() => {
    const shouldOpenBackup =
      sessionStorage.getItem("open_backup_after_oauth") === "true";
    if (shouldOpenBackup) return true;
    return getSettingsFromLocalStorage()?.isBackupOpen || false;
  });
  const [isSessionInfoOpen, setIsSessionInfoOpen] = useState(
    () => getSettingsFromLocalStorage()?.isSessionInfoOpen || false,
  );
  const [isActivitySummaryOpen, setIsActivitySummaryOpen] = useState(
    () => getSettingsFromLocalStorage()?.isActivitySummaryOpen || false,
  );
  const [isPresenceListOpen, setIsPresenceListOpen] = useState(
    () => getSettingsFromLocalStorage()?.isPresenceListOpen || false,
  );
  const [isSystemAdminOpen, setIsSystemAdminOpen] = useState(
    () => getSettingsFromLocalStorage()?.isSystemAdminOpen || false,
  );

  const persistSettings = (
    partial: Partial<Settings & { isSystemAdminOpen: boolean }>,
  ) => {
    const current = getSettingsFromLocalStorage() || {
      showSearch: false,
      hideDone: false,
    };
    saveSettingsInLocalStorage({ ...current, ...partial });
  };

  const toggleSessionInfo = () => {
    setIsSessionInfoOpen((prev) => {
      const next = !prev;
      persistSettings({ isSessionInfoOpen: next });
      return next;
    });
  };

  const toggleActivitySummary = () => {
    setIsActivitySummaryOpen((prev) => {
      const next = !prev;
      persistSettings({ isActivitySummaryOpen: next });
      return next;
    });
  };

  const togglePresenceList = () => {
    setIsPresenceListOpen((prev) => {
      const next = !prev;
      persistSettings({ isPresenceListOpen: next });
      return next;
    });
  };

  const toggleBackup = () => {
    setIsBackupOpen((prev) => {
      const next = !prev;
      persistSettings({ isBackupOpen: next });
      return next;
    });
  };

  const toggleSystemAdmin = () => {
    setIsSystemAdminOpen((prev: boolean) => {
      const next = !prev;
      persistSettings({ isSystemAdminOpen: next });
      return next;
    });
  };

  const renderToggleButton = (isOpen: boolean, onClick: () => void) => (
    <CollapseButton
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={isOpen ? t("toggleButtons.hide") : t("toggleButtons.show")}
      title={isOpen ? t("toggleButtons.hide") : t("toggleButtons.show")}
    >
      <CollapseIcon $open={isOpen} aria-hidden />
    </CollapseButton>
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem("open_backup_after_oauth") === "true") {
      sessionStorage.removeItem("open_backup_after_oauth");
    }

    if (isAdmin) {
      getUserToken().then((token) => {
        if (token) {
          getSystemStatusApi(token).then((response) => {
            if (response.success && response.data?.status?.status === "error") {
              const errorTimestamp = response.data.status.timestamp;
              const lastSeenTimestamp = localStorage.getItem(
                "backup_error_last_seen",
              );

              if (errorTimestamp && lastSeenTimestamp === errorTimestamp) {
                return; // Ten błąd był już pokazany — nie pokazuj ponownie
              }

              if (errorTimestamp) {
                localStorage.setItem("backup_error_last_seen", errorTimestamp);
              }

              dispatch(
                openModal({
                  title: { key: "modal.backupAuthError.title" },
                  message: { key: "modal.backupAuthError.message" },
                  type: "error",
                }),
              );
            }
          });
        }
      });
    }
  }, [isAdmin, dispatch]);

  return (
    <>
      <Header title={t("title")} />

      <Section
        title={
          loggedUserEmail ? (
            <TitleWrapper>
              <AccountAvatar $bgColor={avatarBgColor}>{initial}</AccountAvatar>
              <EmailText>{loggedUserEmail}</EmailText>
            </TitleWrapper>
          ) : (
            t("notLoggedIn")
          )
        }
        extraHeaderContent={<AccountActions />}
        body={<AccountForm />}
        extraContent={
          <>
            <AccountFormActions />
            {loggedUserEmail && (
              <AnimatedSpan $comment $visible={userDevices > 0}>
                <br />
                <strong>
                  {t("deviceCount.device", { count: userDevices })}
                </strong>
              </AnimatedSpan>
            )}
          </>
        }
      />

      {loggedUserEmail && isAdmin && (
        <Section
          title={t("sessionInfo.title")}
          extraHeaderContent={renderToggleButton(
            isSessionInfoOpen,
            toggleSessionInfo,
          )}
          onHeaderClick={toggleSessionInfo}
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={<SessionInfo isSessionInfoOpen={isSessionInfoOpen} />}
          bodyHidden={!isSessionInfoOpen}
        />
      )}

      {loggedUserEmail && isAdmin && (
        <Section
          title={t("activeUsers.summaryTitle")}
          extraHeaderContent={renderToggleButton(
            isActivitySummaryOpen,
            toggleActivitySummary,
          )}
          onHeaderClick={toggleActivitySummary}
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={
            <NameContainer $account>
              <StyledSpan $comment>
                <strong>
                  {t("activeUsers.count", { count: totalUsersCount })}
                </strong>
              </StyledSpan>
              <StyledSpan $comment>
                <strong>
                  {t("allDevices.device", { count: allDevicesCount })}
                </strong>
              </StyledSpan>
            </NameContainer>
          }
          bodyHidden={!isActivitySummaryOpen}
        />
      )}

      {loggedUserEmail && isAdmin && (
        <Section
          title={t("activeUsers.label")}
          extraHeaderContent={renderToggleButton(
            isPresenceListOpen,
            togglePresenceList,
          )}
          onHeaderClick={togglePresenceList}
          onlyOpenButton={true}
          body={<PresenceUsersList />}
          bodyHidden={!isPresenceListOpen}
        />
      )}

      {loggedUserEmail && (
        <Section
          title={t("backup.title")}
          extraHeaderContent={renderToggleButton(isBackupOpen, toggleBackup)}
          onHeaderClick={toggleBackup}
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={<BackupManager />}
          bodyHidden={!isBackupOpen}
        />
      )}

      {loggedUserEmail && isAdmin && (
        <Section
          title={t("systemAdmin.title")}
          extraHeaderContent={renderToggleButton(
            isSystemAdminOpen,
            toggleSystemAdmin,
          )}
          onHeaderClick={toggleSystemAdmin}
          onlyOpenButton={true}
          body={<SystemAdmin />}
          bodyHidden={!isSystemAdminOpen}
        />
      )}
    </>
  );
};

export default AccountPage;
