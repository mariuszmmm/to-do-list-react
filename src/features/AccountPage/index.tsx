import { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { StyledSpan } from "../../common/StyledList";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { PresenceUsersList } from "./PresenceUsersList";
import { SessionInfo } from "./SessionInfo";
import {
  selectAllDevicesCount,
  selectLoggedUserEmail,
  selectTotalUsersCount,
  selectUserDevicesCount
} from "./accountSlice";
import { useTranslation } from "react-i18next";
import { NameContainer } from "../tasks/TasksPage/EditableListName/styled";

const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const userDevices = useAppSelector(selectUserDevicesCount);
  const totalUsersCount = useAppSelector(selectTotalUsersCount);
  const allDevicesCount = useAppSelector(selectAllDevicesCount);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
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
      {loggedUserEmail && (
        <Section
          title={t("sessionInfo.title")}
          body={<SessionInfo />}
        />
      )}
      {loggedUserEmail && (
        <Section
          title={
            <NameContainer $account>
              {t("activeUsers.count", { count: totalUsersCount })}
              <StyledSpan $comment>
                {t("allDevices.device", { count: allDevicesCount })}
              </StyledSpan>
            </NameContainer>
          }
          body={<PresenceUsersList />}
        />
      )}
    </>
  );
};

export default AccountPage;
