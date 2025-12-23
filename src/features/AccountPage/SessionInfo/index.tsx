import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "../../../api/auth";
import { StyledSpan } from "../../../common/StyledList";
import { useTime } from "../../../context/TimeContext";
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

const logDevBlock = (isOpen: boolean, ...args: unknown[]) => {
  if (process.env.NODE_ENV === "development" && isOpen) {
    console.log("\n==================== [SessionInfo] ====================");
    args.forEach((arg) => {
      console.log("[SessionInfo]", arg);
    });
    console.log("======================================================\n");
  }
};

export const SessionInfo = ({
  isSessionInfoOpen,
}: {
  isSessionInfoOpen: boolean;
}) => {
  const { t } = useTranslation("translation", { keyPrefix: "accountPage" });
  const [sessionData, setSessionData] = useState<SessionData>({});
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { now } = useTime();

  useEffect(() => {
    const user = auth.currentUser();

    if (!user) {
      logDevBlock(isSessionInfoOpen, "Brak użytkownika (user == null).");
      setSessionData({});
      setRemainingMs(0);
      return;
    }

    const logBlock: unknown[] = [];
    logBlock.push(`Użytkownik: ${user.email}`, {
      createdAt: user.created_at,
      confirmedAt: user.confirmed_at,
      token: user.token,
    });

    if (user.token) {
      logBlock.push({
        Token: {
          expiresAt: user.token.expires_at
            ? new Date(user.token.expires_at).toLocaleString()
            : undefined,
          refreshToken: !!user.token.refresh_token,
        }
      });
    } else {
      logBlock.push("Brak tokena w user.token");
    }

    const remaining = getTokenExpiresIn(user, now);
    logBlock.push(`Pozostały czas ważności tokena (s): ${Math.floor(remaining / 1000)}`);

    logDevBlock(isSessionInfoOpen, ...logBlock);

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

    setRemainingMs(remaining);
  }, [loggedUserEmail, now, isSessionInfoOpen]);

  if (!sessionData.email) return null;

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
            {t("sessionInfo.createdAt")}: <strong>{sessionData.createdAt}</strong>
          </StyledSpan>
          <br />
        </>
      )}

      {sessionData.confirmedAt && (
        <>
          <StyledSpan $comment>
            {t("sessionInfo.confirmedAt")}: <strong>{sessionData.confirmedAt}</strong>
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
            {t("sessionInfo.tokenExpiresAt")}: <strong>{sessionData.tokenExpiresAt}</strong>
          </StyledSpan>
          <br />
        </>
      )}

      <StyledSpan $comment>
        {t("sessionInfo.tokenExpiresIn")}: <strong>{formattedTime}</strong>
      </StyledSpan>
      <br />

      <StyledSpan $comment $tokenStatus={tokenValid ? "active" : "expired"}>
        {t("sessionInfo.tokenStatus")}:{" "}
        <strong>
          {tokenValid
            ? t("sessionInfo.tokenActive")
            : t("sessionInfo.tokenExpired")}
        </strong>
      </StyledSpan>
    </div>
  );
};
