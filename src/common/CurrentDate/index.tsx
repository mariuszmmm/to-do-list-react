import { useTranslation } from "react-i18next";
import { useCurrentDate } from "../../hooks/useCurrentDate";
import {
  formatCurrentDay,
  formatCurrentTime,
} from "../../utils/formatCurrentDate";
import { StyledDate, DateContainer } from "./styled";
import { useLocation } from "react-router-dom";

export const CurrentDate = ({ authRoutes }: { authRoutes: string[] }) => {
  const currentDate = useCurrentDate();
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "currentDate",
  });

  const authRoute = authRoutes.includes(pathname);
  if (authRoute) return null;

  return (
    <DateContainer>
      <StyledDate $comentary>
        {t("desc")}
        {formatCurrentDay(currentDate, i18n.language)},
      </StyledDate>
      <StyledDate>{formatCurrentTime(currentDate, i18n.language)}</StyledDate>
    </DateContainer>
  );
};
