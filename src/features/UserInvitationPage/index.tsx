import { UserInvitationForm } from "./UserInvitationForm";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { Container } from "../../common/Container";
import { Text } from "../../common/Text";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { RecoveryStatus } from "../../types";

const UserInvitationPage = () => {
  const [status, setStatus] = useState<RecoveryStatus>("passwordChange");
  const { t } = useTranslation("translation", {
    keyPrefix: "userInvitationPage",
  });
  // Don't use current user if we are in invitation process to avoid showing background session email
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

  return (
    <>
      {status === "passwordChange" ? (
        <>
          <Header title={t("title")} />
          <Section
            title={invitedEmail || t("subTitle")}
            body={
              <UserInvitationForm
                setStatus={setStatus}
                setInvitedEmail={setInvitedEmail}
              />
            }
          />
        </>
      ) : status === "linkExpired" ? (
        <Container>
          <Text>
            <b>
              <Trans i18nKey="userInvitationPage.message.error" />
            </b>
          </Text>
          <Text style={{ marginTop: "20px" }}>{t("tryAgain")}</Text>
        </Container>
      ) : null}
    </>
  );
};

export default UserInvitationPage;
