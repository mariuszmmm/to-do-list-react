import { AccountRecoveryForm } from "./AccountRecoveryForm";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { Container } from "../../common/Container";
import { Text } from "../../common/Text";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { RecoveryStatus } from "../../types";

const AccountRecoveryPage = () => {
  const [status, setStatus] = useState<RecoveryStatus>("passwordChange");
  const { t } = useTranslation("translation", {
    keyPrefix: "accountRecoveryPage",
  });
  // Don't use current user if we are in recovery process to avoid showing background session email
  const [recoveredEmail, setRecoveredEmail] = useState<string | null>(null);

  return (
    <>
      {status === "passwordChange" ? (
        <>
          <Header title={t("title")} />
          <Section
            title={recoveredEmail || t("subTitle")}
            body={
              <AccountRecoveryForm
                setStatus={setStatus}
                setRecoveredEmail={setRecoveredEmail}
              />
            }
          />
        </>
      ) : (
        <Container>
          <Text>
            <b>
              <Trans
                i18nKey={
                  status === "accountRecovered"
                    ? "accountRecoveryPage.message.success"
                    : "accountRecoveryPage.message.error"
                }
              />
            </b>
          </Text>
          <Text style={{ marginTop: "20px" }}>
            {status === "accountRecovered" ? t("closeTab") : t("tryAgain")}
          </Text>
        </Container>
      )}
    </>
  );
};

export default AccountRecoveryPage;
