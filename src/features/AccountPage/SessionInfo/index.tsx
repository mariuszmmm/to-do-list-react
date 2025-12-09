import { auth } from "../../../api/auth";
import { StyledSpan } from "../../../common/StyledList";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { selectLoggedUserEmail } from "../accountSlice";
import { formatTokenTime } from "../../../utils/formatTokenTime";
import { getTokenExpiresIn } from "../../../utils/tokenUtils";

interface SessionData {
  email?: string;
  createdAt?: string;
  confirmedAt?: string;
  tokenExpiresAt?: string;
}

export const SessionInfo = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const [sessionData, setSessionData] = useState<SessionData>({});
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Aktualizuj dane sesji i uruchom countdown
  useEffect(() => {
    const updateSessionData = () => {
      const user = auth.currentUser();
      if (!user) {
        setSessionData({});
        setRemainingMs(0);
        return;
      }

      setSessionData({
        email: user.email,
        createdAt: user.created_at
          ? new Date(user.created_at).toLocaleString()
          : undefined,
        confirmedAt: user.confirmed_at
          ? new Date(user.confirmed_at).toLocaleString()
          : undefined,
        tokenExpiresAt: user.token?.expires_at
          ? new Date(user.token.expires_at).toLocaleString()
          : undefined,
      });

      // Ustaw początkową wartość pozostałego czasu
      const remaining = getTokenExpiresIn(user);
      setRemainingMs(remaining);
    };

    updateSessionData();
  }, [loggedUserEmail]);

  // Countdown tokena co 1 sekundę
  useEffect(() => {
    if (!loggedUserEmail) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setRemainingMs(0);
      return;
    }

    const updateCountdown = () => {
      const user = auth.currentUser();
      if (!user) {
        setRemainingMs(0);
        return;
      }

      const remaining = getTokenExpiresIn(user);
      setRemainingMs(remaining);
    };

    // Aktualizuj co 1 sekundę
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [loggedUserEmail]);

  if (!sessionData.email) {
    return null;
  }

  const tokenValid = remainingMs > 0;
  const formattedTime = formatTokenTime(remainingMs);

  return (
    <div>
      <StyledSpan $comment>
        <strong>{t("sessionInfo.title")}</strong>
      </StyledSpan>
      <br />
      <br />

      {sessionData.createdAt && (
        <>
          <StyledSpan $comment>
            {t("sessionInfo.createdAt")}:{" "}
            <strong>{sessionData.createdAt}</strong>
          </StyledSpan>
          <br />
        </>
      )}

      {sessionData.confirmedAt && (
        <>
          <StyledSpan $comment>
            {t("sessionInfo.confirmedAt")}:{" "}
            <strong>{sessionData.confirmedAt}</strong>
          </StyledSpan>
          <br />
        </>
      )}

      <br />

      <StyledSpan $comment>
        <strong>{t("sessionInfo.tokenTitle")}</strong>
      </StyledSpan>
      <br />
      <br />

      {sessionData.tokenExpiresAt && (
        <>
          <StyledSpan $comment>
            {t("sessionInfo.tokenExpiresAt")}:{" "}
            <strong>{sessionData.tokenExpiresAt}</strong>
          </StyledSpan>
          <br />
        </>
      )}

      <StyledSpan $comment>
        {t("sessionInfo.tokenExpiresIn")}: {" "}
        <strong>{formattedTime}</strong>
      </StyledSpan>
      <br />

      <StyledSpan $comment $tokenStatus={tokenValid ? "active" : "expired"}>
        {t("sessionInfo.tokenStatus")}: {" "}
        <strong>
          {tokenValid
            ? "✔️ " + t("sessionInfo.tokenActive")
            : "❌ " + t("sessionInfo.tokenExpired")}
        </strong>
      </StyledSpan>
    </div>
  );
};
