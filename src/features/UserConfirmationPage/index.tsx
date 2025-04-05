import { useEffect, useState } from "react";
import { auth } from "../../api/auth";
import { getConfimationTokenFromSessionStorage } from "../../utils/sessionStorage";
import { useAppDispatch } from "../../hooks";
import { openModal } from "../../Modal/modalSlice";
import { Text } from "../../common/Text";
import { Container } from "../../common/Container";
import i18n from "../../utils/i18n";
import { Trans } from "react-i18next";

type Status = "waiting" | "success" | "error";

const UserConfirmationPage = () => {
  const [status, setStatus] = useState<Status>("waiting");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const confirmation = async () => {
      try {
        dispatch(
          openModal({
            title: i18n.t("modal.confirmation.title"),
            message: { key: "modal.confirmation.message.loading" },
            type: "loading",
          })
        );
        const token = getConfimationTokenFromSessionStorage();
        if (!token) throw new Error("No token");
        await auth.confirm(token);
        dispatch(
          openModal({
            message: { key: "modal.confirmation.message.success" },
            type: "success",
          })
        );
        setStatus("success");
      } catch (error) {
        dispatch(
          openModal({
            message: { key: "modal.confirmation.message.error.default" },
            type: "error",
          })
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
        </Container>
      ) : null}
    </>
  );
};

export default UserConfirmationPage;
