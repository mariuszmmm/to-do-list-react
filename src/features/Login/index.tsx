import Header from "../../common/Header";
import Section from "../../common/Section";
import LogForm from "./LogForm";

const Login = () => {
  return (
    <>
      <Header title="Logowanie" />
      <Section
        title="Podaj dane"
        extraHeaderContent={null}
        body={<LogForm />}
      />
    </>
  );
};

export default Login;
