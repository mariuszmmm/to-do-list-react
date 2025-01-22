import { useAppSelector } from "../../hooks";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { AccountButtons } from "./AccountButtons";
import { AccountForm } from "./AccountForm";
import { AccountExtraButtons } from "./AccountExtraButtons";
import { selectLoggedUser } from "./accountSlice";

const AccountPage = () => {
  const loggedUser = useAppSelector(selectLoggedUser);

  return (
    <>
      <Header title="Twoje konto" />
      <Section
        title={loggedUser || "Jesteś niezalogowany"}
        extraHeaderContent={<AccountButtons />}
        body={<AccountForm />}
        extraContent={<AccountExtraButtons />}
      />
    </>
  );
};

export default AccountPage;
