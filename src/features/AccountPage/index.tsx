import { useAppSelector } from "../../hooks";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { selectLoggedUserEmail } from "./accountSlice";

const AccountPage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);

  return (
    <>
      <Header title="Twoje konto" />
      <Section
        title={loggedUserEmail || "Jesteś niezalogowany"}
        extraHeaderContent={<AccountButtons />}
        body={<AccountForm />}
        extraContent={<AccountExtraButtons />}
      />
    </>
  );
};

export default AccountPage;
