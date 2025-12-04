
import { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { selectLoggedUserEmail } from "./accountSlice";
import { useTranslation } from "react-i18next";
import { getOrCreateDeviceId } from "../../utils/deviceId";
import { useAblyPresence } from "../../hooks/useAblyPresence";

const ABLY_ACCOUNT_CHANNEL = "account:presence";

const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const deviceId = getOrCreateDeviceId();
  const userId = loggedUserEmail || deviceId;
  const membersCount = useAblyPresence(ABLY_ACCOUNT_CHANNEL, userId);

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
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <strong>{t("activeUsers", { count: membersCount })}</strong>
      </div>
    </>
  );
};

export default AccountPage;
