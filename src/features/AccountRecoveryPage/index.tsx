import { AccountRecoveryForm } from "./AccountRecoveryForm";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { auth } from "../../api/auth";
import { Container } from "../../common/Container";
import { Text } from "../../common/Text";
import { useState } from "react";

export type RecoveryStatus =
  | "accountRecovered"
  | "changePassword"
  | "linkExpired";

const AccountRecoveryPage = () => {
  const [status, setStatus] = useState<RecoveryStatus>("changePassword");
  const user = auth.currentUser();

  return (
    <>
      {status === "changePassword" ? (
        <>
          <Header title="Zmiana hasła" />
          <Section
            title={user?.email || "Wpisz nowe hasło"}
            body={<AccountRecoveryForm setStatus={setStatus} />}
          />
        </>
      ) : (
        <Container>
          <Text>
            <b>
              {status === "accountRecovered"
                ? "Konto zostało odzyskane"
                : "Link wygasł lub został użyty"}
              ,
              <br />
              zamknij stronę.
            </b>
          </Text>
        </Container>
      )}
    </>
  );
};

export default AccountRecoveryPage;
