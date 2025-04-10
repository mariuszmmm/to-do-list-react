import { useTranslation } from "react-i18next";
import { useCurrentDate } from "../../hooks/useCurrentDate";
import {
  formatCurrentDay,
  formatCurrentTime,
} from "../../utils/formatCurrentDate";
import { StyledDate, DateContainer } from "./styled";

export const CurrentDate = () => {
  const currentDate = useCurrentDate();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "currentDate",
  });

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
