import { useAppSelector } from "../../hooks";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { selectLoggedUserEmail } from "./accountSlice";
import { useTranslation } from "react-i18next";

const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={loggedUserEmail || t("notLoggedIn")}
        extraHeaderContent={<AccountButtons />}
        body={<AccountForm />}
        extraContent={<AccountExtraButtons />}
      />
    </>
  );
};

export default AccountPage;
