import { useEffect, useState, useRef } from "react";
import { auth } from "../../api/auth";
import { getConfimationTokenFromSessionStorage } from "../../utils/sessionStorage";
import { useAppDispatch } from "../../hooks/redux";
import { openModal } from "../../Modal/modalSlice";
import { Text } from "../../common/Text";
import { Container } from "../../common/Container";
import { Trans, useTranslation } from "react-i18next";
import { StyledLink } from "../../common/StyledLink";
import { setLoggedUserEmail } from "../AccountPage/accountSlice";
import Ably from "ably";
import { getOrCreateDeviceId } from "../../utils/deviceId";

type Status = "waiting" | "success" | "error";

const UserConfirmationPage = () => {
  const [status, setStatus] = useState<Status>("waiting");
  const { t } = useTranslation("translation", {
    keyPrefix: "confirmationPage",
  });
  const dispatch = useAppDispatch();
  const webhookTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any | null>(null);

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

        await new Promise<void>((resolve, reject) => {
          try {
            const deviceId = getOrCreateDeviceId();
            const ably = new Ably.Realtime({
              authCallback: async (tokenParams, callback) => {
                try {
                  const response = await fetch(
                    `/ably-auth?email=${userEmail}&deviceId=${deviceId}`,
                    { method: "GET" }
                  );

                  if (!response.ok) {
                    const errorData = await response.json();
                    callback(errorData.message || response.statusText, null);
                    return;
                  }

                  const ablyTokenRequest = await response.json();
                  callback(null, ablyTokenRequest);
                } catch (err) {
                  const errorMessage =
                    err instanceof Error ? err.message : String(err);
                  callback(errorMessage, null);
                }
              },
            });

            const channel = ably.channels.get(`user:${userEmail}:confirmation`);
            channelRef.current = channel;

            const handleWebhook = async (message: any) => {
              cleanup();
              resolve();
            };

            const cleanup = async () => {
              if (channelRef.current) {
                await channelRef.current.detach();
                channelRef.current = null;
              }
              if (webhookTimeoutRef.current) {
                clearTimeout(webhookTimeoutRef.current);
              }
            };

            channel.subscribe("user-confirmed", handleWebhook);

            webhookTimeoutRef.current = setTimeout(async () => {
              await cleanup();
              resolve();
            }, 10000);
          } catch (error) {
            reject(error);
          }
        });

        dispatch(setLoggedUserEmail(userEmail));

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

    return () => {
      if (webhookTimeoutRef.current) {
        clearTimeout(webhookTimeoutRef.current);
      }
    };
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
