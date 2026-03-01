import { useEffect, useState } from "react";
import { auth } from "../../api/auth";
import { getConfirmationTokenFromSessionStorage } from "../../utils/storage/sessionStorage";
import { useAppDispatch } from "../../hooks/redux/redux";
import { openModal } from "../../Modal/modalSlice";
import { Text } from "../../common/Text";
import { Container } from "../../common/Container";
import { Trans, useTranslation } from "react-i18next";

type Status = "waiting" | "success" | "error";

const UserConfirmationPage = () => {
  const [status, setStatus] = useState<Status>("waiting");
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "confirmationPage",
  });
  const dispatch = useAppDispatch();

  console.log("UserConfirmationPage   t ", {
    tekst: i18n.t("modal.confirmation.title"),
  });

  useEffect(() => {
    const confirmation = async () => {
      try {
        dispatch(
          openModal({
            title: { key: "modal.confirmation.title" },
            message: { key: "modal.confirmation.message.loading" },
            type: "loading",
          }),
        );

        const token = getConfirmationTokenFromSessionStorage();
        if (!token) throw new Error("No token");

        await auth.confirm(token);

        dispatch(
          openModal({
            title: { key: "modal.confirmation.title" },
            message: { key: "modal.confirmation.message.success" },
            type: "success",
          }),
        );
        setStatus("success");
      } catch (error) {
        dispatch(
          openModal({
            title: { key: "modal.confirmation.title" },
            message: { key: "modal.confirmation.message.error.default" },
            type: "error",
          }),
        );
        setStatus("error");
      }
    };

    confirmation();
  }, [dispatch]);

  return (
    <>
      {status !== "waiting" ? (
        <Container>
          <Text>
            <b>
              <Trans
                i18nKey={
                  status === "error"
                    ? "confirmationPage.message.error"
                    : "confirmationPage.message.success"
                }
              />
            </b>
          </Text>
          <Text style={{ marginTop: "20px" }}>
            {status === "success" ? t("closeTab") : t("tryAgain")}
          </Text>
        </Container>
      ) : null}
    </>
  );
};

export default UserConfirmationPage;
