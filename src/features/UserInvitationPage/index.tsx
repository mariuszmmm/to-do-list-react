import { UserInvitationForm } from "./UserInvitationForm";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { auth } from "../../api/auth";
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
  const user = auth.currentUser();

  return (
    <>
      {status === "passwordChange" ? (
        <>
          <Header title={t("title")} />
          <Section
            title={user?.email || t("subTitle")}
            body={<UserInvitationForm setStatus={setStatus} />}
          />
        </>
      ) : (
        <Container>
          <Text>
            <b>
              <Trans
                i18nKey={
                  status === "accountRecovered"
                    ? "userInvitationPage.message.success"
                    : "userInvitationPage.message.error"
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

export default UserInvitationPage;
