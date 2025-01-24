import { useEffect } from "react";
// import Header from "../../common/Header";
// import Section from "../../common/Section";
// import LogForm from "./LogForm";
import netlifyIdentity from "netlify-identity-widget";

const Login = () => {
  // return (
  //   <>
  //     <Header title="Logowanie" />
  //     <Section
  //       title="Podaj dane"
  //       extraHeaderContent={null}
  //       body={<LogForm />}
  //     />
  //   </>
  // );
  useEffect(() => {
    netlifyIdentity.init({ locale: "pl" });

    const url = new URL(window.location.href);
    const token = url.hash.match(/confirmation_token=([^&]*)/);
    if (token) {
      netlifyIdentity
        .confirm(token[1], true)
        .then((user: any) => {
          console.log("User confirmed:", user);
        })
        .catch((err: Error) => {
          console.error("Error confirming user:", err);
        });
    }
  }, []);

  const handleLogin = () => {
    netlifyIdentity.open(); // Otwiera panel logowania
  };
  // /confirmation_token=nT3KyZ_fSdQsvHrLlwo_6g

  return (
    <div>
      {/* <button onClick={handleLogin}>Log In</button> */}

      <div data-netlify-identity-menu></div>

      <div data-netlify-identity-button>Login with Netlify Identity</div>
    </div>
  );
};

export default Login;
