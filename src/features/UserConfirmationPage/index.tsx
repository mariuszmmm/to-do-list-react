import { useEffect, useState, useRef } from "react";
import { auth } from "../../api/auth";
import { getConfimationTokenFromSessionStorage } from "../../utils/sessionStorage";
import { useAppDispatch } from "../../hooks/redux";
import { openModal } from "../../Modal/modalSlice";
import { Text } from "../../common/Text";
import { Container } from "../../common/Container";
import { Trans, useTranslation } from "react-i18next";
import { StyledLink } from "../../common/StyledLink";
import { useAblyManager } from "../../hooks/useAblyManager";

type Status = "waiting" | "success" | "error";

const UserConfirmationPage = () => {
  const [status, setStatus] = useState<Status>("waiting");
  const { t } = useTranslation("translation", {
    keyPrefix: "confirmationPage",
  });
  const dispatch = useAppDispatch();
  const { onConfirmation } = useAblyManager();
  const webhookTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

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
        const token = getConfimationTokenFromSessionStorage();
        if (!token) throw new Error("No token");

        // Potwierdź w Netlify GoTrue
        const confirmedUser = await auth.confirm(token);
        const userEmail = confirmedUser?.email;

        if (!userEmail) {
          throw new Error("Failed to get user email after confirmation");
        }

        console.log(`[Confirmation] User ${userEmail} confirmed in GoTrue`);

        // Czekaj na webhook from confirmUser (up to 10 seconds)
        // Webhook wysyła event Ably o potwierdzeniu
        await new Promise<void>((resolve, reject) => {
          try {
            const handleWebhook = () => {
              console.log(
                `[Confirmation] Webhook received for ${userEmail}`
              );
              cleanup();
              resolve();
            };

            const cleanup = () => {
              if (unsubscribeRef.current) {
                unsubscribeRef.current();
              }
              if (webhookTimeoutRef.current) {
                clearTimeout(webhookTimeoutRef.current);
              }
            };

            unsubscribeRef.current = onConfirmation(userEmail, handleWebhook);

            // Timeout 10 sekund na webhook
            webhookTimeoutRef.current = setTimeout(() => {
              console.warn(
                `[Confirmation] Webhook timeout for ${userEmail}, proceeding anyway`
              );
              cleanup();
              resolve(); // Kontynuuj mimo braku webhooks (user jest potwierdzony w GoTrue)
            }, 10000);
          } catch (error) {
            reject(error);
          }
        });

        dispatch(
          openModal({
            title: { key: "modal.confirmation.title" },
            message: { key: "modal.confirmation.message.success" },
            type: "success",
          }),
        );
        setStatus("success");
      } catch (error) {
        console.error("[Confirmation] Error:", error);
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

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (webhookTimeoutRef.current) {
        clearTimeout(webhookTimeoutRef.current);
      }
    };
  }, [dispatch, onConfirmation]);

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
          <StyledLink to="/tasks">
            <b>{"⇨ "}</b>
            {t("home")}
          </StyledLink>
        </Container>
      ) : null}
    </>
  );
};

export default UserConfirmationPage;
