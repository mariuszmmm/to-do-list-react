import { auth } from "../../../api/auth";
import { StyledSpan } from "../../../common/StyledList";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { selectTokenRemainingMs } from "../accountSlice";

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
  const remainingMs = useAppSelector(selectTokenRemainingMs);

  useEffect(() => {
    const updateSessionData = () => {
      const user = auth.currentUser();
      if (!user) {
        setSessionData({});
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
    };

    updateSessionData();
  }, [remainingMs]);

  if (!sessionData.email) {
    return null;
  }

  const tokenValid = remainingMs > 0;
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const formattedTime = (() => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value: number) => value.toString().padStart(2, "0");
    return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
  })();

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
