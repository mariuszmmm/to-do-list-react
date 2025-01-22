import { AccountRecoveryForm } from "./AccountRecoveryForm";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { auth } from "../../utils/auth";

const AccountRecoveryPage = () => {
  const user = auth.currentUser();

  return (
    <>
      <Header title="Zmiana hasła" />
      <Section
        title={user?.email || "Wpisz nowe hasło"}
        body={<AccountRecoveryForm />}
      />
    </>
  );
};

export default AccountRecoveryPage;
