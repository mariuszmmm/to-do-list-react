import { AccountRecoveryForm } from "./AccountRecoveryForm";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { auth } from "../../api/auth";
import { Container } from "../../common/Container";
import { Text } from "../../common/Text";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

export type RecoveryStatus =
  | "accountRecovered"
  | "passwordChange"
  | "linkExpired";

const AccountRecoveryPage = () => {
  const [status, setStatus] = useState<RecoveryStatus>("passwordChange");
  const { t } = useTranslation("translation", {
    keyPrefix: "accountRecoveryPage",
  });
  const user = auth.currentUser();

  return (
    <>
      {status === "passwordChange" ? (
        <>
          <Header title={t("title")} />
          <Section
            title={user?.email || t("subTitle")}
            body={<AccountRecoveryForm setStatus={setStatus} />}
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
        </Container>
      )}
    </>
  );
};

export default AccountRecoveryPage;
