import Header from "../../common/Header";
import Section from "../../common/Section";
import LoginForm from "./LoginForm";
import LoginButtons from "./LoginButtons";
import { auth } from "./auth";

const Account = () => {
  const user = auth.currentUser();

  return (
    <>
      <Header title="Twoje konto" />
      <Section
        title={user?.email || "niezalogowany"}
        extraHeaderContent={!user && <LoginButtons />}
        body={<LoginForm />}
      />
    </>
  );
};

export default Account;
