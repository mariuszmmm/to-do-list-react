
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { selectLoggedUserEmail } from "./accountSlice";
import { useTranslation } from "react-i18next";
// import { getOrCreateDeviceId } from "../../utils/deviceId";
// import { useAblyPresence } from "../../hooks/useAblyPresence";

// const ABLY_ACCOUNT_CHANNEL = "account:presence";

const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  // const deviceId = getOrCreateDeviceId();
  // const userId = loggedUserEmail || deviceId;
  // const membersCount = useAblyPresence(ABLY_ACCOUNT_CHANNEL, userId);
  const [backendActiveUsers, setBackendActiveUsers] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Pobierz liczbę aktywnych użytkowników z backendu
    const fetchBackendActiveUsers = () => {
      fetch("/.netlify/functions/reportPresence")
        .then((res) => res.text())
        .then((text) => {
          const match = text.match(/Active users: (\d+)/);
          if (match) setBackendActiveUsers(Number(match[1]));
        })
        .catch(() => setBackendActiveUsers(null));
    };
    fetchBackendActiveUsers();
    const interval = setInterval(fetchBackendActiveUsers, 30000);
    return () => clearInterval(interval);
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
      <div style={{ textAlign: "center", marginTop: 16 }}>
        {/* <strong>{t("activeUsers", { count: membersCount })}</strong> */}
        <br />
        <span style={{ fontSize: 12, color: "#888" }}>
          Backend (serverless): {backendActiveUsers !== null ? backendActiveUsers : "?"}
        </span>
      </div>
    </>
  );
};

export default AccountPage;
