import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../hooks/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { StyledSpan } from "../../common/StyledList";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { BackupButtons } from "./BackupButtons";
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

  const renderToggleButton = (isOpen: boolean, onClick: () => void) => (
    <ToggleButton
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={isOpen ? t("toggle.hide") : t("toggle.show")}
      title={isOpen ? t("toggle.hide") : t("toggle.show")}
    >
      <ToggleIcon $open={isOpen} aria-hidden />
    </ToggleButton>
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
            <AccountExtraButtons />
            <br />
            {loggedUserEmail &&
              <StyledSpan $comment>
                {t("deviceCount.device", { count: userDevices })}
              </StyledSpan>
            }
          </>
        }
      />
      {loggedUserEmail && isAdmin && (
        <Section
          title={t("sessionInfo.title")}
          extraHeaderContent={renderToggleButton(
            isSessionInfoOpen,
            () =>
              setIsSessionInfoOpen((prev) => {
                const next = !prev;
                persistSettings({ isSessionInfoOpen: next });
                return next;
              })
          )}
          onHeaderClick={() =>
            setIsSessionInfoOpen((prev) => {
              const next = !prev;
              persistSettings({ isSessionInfoOpen: next });
              return next;
            })
          }
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={<SessionInfo />}
          bodyHidden={!isSessionInfoOpen}
        />
      )}
      {loggedUserEmail && isAdmin && (
        <Section
          title={t("activeUsers.summaryTitle")}
          extraHeaderContent={renderToggleButton(
            isActivitySummaryOpen,
            () =>
              setIsActivitySummaryOpen((prev) => {
                const next = !prev;
                persistSettings({ isActivitySummaryOpen: next });
                return next;
              })
          )}
          onHeaderClick={() =>
            setIsActivitySummaryOpen((prev) => {
              const next = !prev;
              persistSettings({ isActivitySummaryOpen: next });
              return next;
            })
          }
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={
            <NameContainer $account>
              <StyledSpan $comment>
                {t("activeUsers.count", { count: totalUsersCount })}
              </StyledSpan>
              <StyledSpan $comment>
                {t("allDevices.device", { count: allDevicesCount })}
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
            () =>
              setIsPresenceListOpen((prev) => {
                const next = !prev;
                persistSettings({ isPresenceListOpen: next });
                return next;
              })
          )}
          onHeaderClick={() =>
            setIsPresenceListOpen((prev) => {
              const next = !prev;
              persistSettings({ isPresenceListOpen: next });
              return next;
            })
          }
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={<PresenceUsersList />}
          bodyHidden={!isPresenceListOpen}
        />
      )}
      {loggedUserEmail && isAdmin && (
        <Section
          title={t("backup.title")}
          extraHeaderContent={renderToggleButton(
            isBackupOpen,
            () =>
              setIsBackupOpen((prev) => {
                const next = !prev;
                persistSettings({ isBackupOpen: next });
                return next;
              })
          )}
          onHeaderClick={() =>
            setIsBackupOpen((prev) => {
              const next = !prev;
              persistSettings({ isBackupOpen: next });
              return next;
            })
          }
          onlyOpenButton={isPresenceListOpen !== undefined}
          body={<BackupButtons />}
          bodyHidden={!isBackupOpen}
        />
      )}
    </>
  );
};

export default AccountPage;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-left: 12px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.color.teal};
  font-size: 20px;
  line-height: 1;
  transition: color 0.2s ease, filter 0.2s ease;

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(125%);
  }
`;

const ToggleIcon = styled.span<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;

  &::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border: 2px solid currentColor;
    border-top: 0;
    border-left: 0;
    transform: ${({ $open }) => ($open ? "rotate(225deg)" : "rotate(45deg)")};
    transition: transform 0.2s ease;
  }
`;
