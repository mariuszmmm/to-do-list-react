import { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { selectCurrentUserEmail, selectLoggedUserEmail, selectPresenceUsers, selectUserDevicesCount } from "./accountSlice";
import { useTranslation } from "react-i18next";

const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const userDevices = useAppSelector(selectUserDevicesCount);
  const presenceUsers = useAppSelector(selectPresenceUsers);
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
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
        extraContent={<AccountExtraButtons />}
      />
      {loggedUserEmail &&
        <div >
          <p style={{ textAlign: 'center' }}>
            <strong>{t("deviceCount.device", { count: userDevices })}</strong>
          </p>
          <p style={{ marginTop: '6em', marginBottom: '0.5em' }}>
            <strong>{t("activeUsers.count", { count: presenceUsers.length })}</strong>
          </p>
          <p style={{ marginBottom: '0.5em' }}>
            <strong>{t("allDevices.device", { count: presenceUsers.reduce((sum, user) => sum + user.deviceCount, 0) })}</strong>
          </p>
          <p style={{ marginBottom: '0.5em' }}>
            <strong>{t("activeUsers.label")}</strong>
          </p>
          <ul style={{ listStyle: 'none', paddingLeft: '6px', margin: '4px' }}>
            {presenceUsers.map(({ email, deviceCount }) => {
              const isCurrentUser = email === currentUserEmail;
              const deviceText = deviceCount > 1 && ` (${deviceCount})`
              return (
                <li key={email}>
                  - <span>{isCurrentUser ? <strong>{email}</strong> : email}</span>
                  {deviceText && <span>{deviceText}</span>}
                </li>
              );
            })}
          </ul>
        </div>}
    </>
  );
};

export default AccountPage;
