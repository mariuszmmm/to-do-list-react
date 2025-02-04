import Header from "../../common/Header";
import Section from "../../common/Section";
import LoginForm from "./LoginForm";
import LoginButtons from "./LoginButtons";
import { useSelector } from "react-redux";
import { selectLogged } from "./loginSlice";

const Account = () => {
  const logged = useSelector(selectLogged);

  return (
    <>
      <Header title="Twoje konto" />
      <Section
        title={logged || "niezalogowany"}
        extraHeaderContent={<LoginButtons />}
        body={<LoginForm />}
      />
    </>
  );
};

export default Account;
