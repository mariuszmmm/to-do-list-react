import { useTranslation } from "react-i18next";
import { useCurrentDate } from "../../hooks/useCurrentDate";
import {
  formatCurrentDay,
  formatCurrentTime,
} from "../../utils/formatCurrentDate";
import { Date, DateContainer } from "./styled";

export const CurrentDate = () => {
  const currentDate = useCurrentDate();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "currentDate",
  });

  return (
    <DateContainer>
      <Date $description>
        {t("desc")}
        {formatCurrentDay(currentDate, i18n.language)},
      </Date>
      <Date>{formatCurrentTime(currentDate, i18n.language)}</Date>
    </DateContainer>
  );
};
