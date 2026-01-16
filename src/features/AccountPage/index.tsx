import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { StyledSpan } from "../../common/StyledList";
import { CollapseButton, CollapseIcon } from "../../common/CollapseButton";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountFormActions } from "./AccountFormActions";
import { BackupManager } from "./BackupManager";
import { PresenceUsersList } from "./PresenceUsersList";
import { SessionInfo } from "./SessionInfo";
import { Settings } from "../../types";
import {
  selectAllDevicesCount,
  selectLoggedUserEmail,
  selectIsAdmin,
  selectTotalUsersCount,
  selectUserDevicesCount
} from "./accountSlice";
import { useTranslation } from "react-i18next";
import { NameContainer } from "../tasks/TasksPage/EditableListName/styled";
import {
  getSettingsFromLocalStorage,
  saveSettingsInLocalStorage,
} from "../../utils/localStorage";


const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const isAdmin = useAppSelector(selectIsAdmin);
  const userDevices = useAppSelector(selectUserDevicesCount);
  const totalUsersCount = useAppSelector(selectTotalUsersCount);
  const allDevicesCount = useAppSelector(selectAllDevicesCount);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const [isBackupOpen, setIsBackupOpen] = useState(() => {
    const shouldOpenBackup = sessionStorage.getItem("open_backup_after_oauth") === "true";
    if (shouldOpenBackup) return true;
    return getSettingsFromLocalStorage()?.isBackupOpen || false;
  });
  const [isSessionInfoOpen, setIsSessionInfoOpen] = useState(
    () => getSettingsFromLocalStorage()?.isSessionInfoOpen || false
  );
  const [isActivitySummaryOpen, setIsActivitySummaryOpen] = useState(
    () => getSettingsFromLocalStorage()?.isActivitySummaryOpen || false
  );
  const [isPresenceListOpen, setIsPresenceListOpen] = useState(
    () => getSettingsFromLocalStorage()?.isPresenceListOpen || false
  );

  const persistSettings = (partial: Partial<Settings>) => {
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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem("open_backup_after_oauth") === "true") {
      sessionStorage.removeItem("open_backup_after_oauth");
    }
  }, []);

  return (
    <>
      <Header title={t("title")} />

      <Section
        title={loggedUserEmail || t("notLoggedIn")}
        extraHeaderContent={<AccountButtons />}
        body={<AccountForm />}
        extraContent={
          <>
            <AccountFormActions />
            <br />
            {loggedUserEmail && userDevices > 0 &&
              <StyledSpan $comment >
                <strong>{t("deviceCount.device", { count: userDevices })}</strong>
              </StyledSpan>
            }
          </>
        }
      />

      {loggedUserEmail && (
        <Section
          title={t("sessionInfo.title")}
          extraHeaderContent={renderToggleButton(isSessionInfoOpen, toggleSessionInfo)}
          onHeaderClick={toggleSessionInfo}
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={<SessionInfo isSessionInfoOpen={isSessionInfoOpen} />}
          bodyHidden={!isSessionInfoOpen}
        />
      )}

      {loggedUserEmail && isAdmin && (
        <Section
          title={t("activeUsers.summaryTitle")}
          extraHeaderContent={renderToggleButton(isActivitySummaryOpen, toggleActivitySummary)}
          onHeaderClick={toggleActivitySummary}
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={
            <NameContainer $account>
              <StyledSpan $comment>
                <strong>{t("activeUsers.count", { count: totalUsersCount })}</strong>
              </StyledSpan>
              <StyledSpan $comment>
                <strong>{t("allDevices.device", { count: allDevicesCount })}</strong>
              </StyledSpan>
            </NameContainer>
          }
          bodyHidden={!isActivitySummaryOpen}
        />
      )}

      {loggedUserEmail && isAdmin && (
        <Section
          title={t("activeUsers.label")}
          extraHeaderContent={renderToggleButton(isPresenceListOpen, togglePresenceList)}
          onHeaderClick={togglePresenceList}
          onlyOpenButton={isPresenceListOpen !== undefined}
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

    </>
  );
};

export default AccountPage;
