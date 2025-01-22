import { useCurrentDate } from "../../hooks/useCurrentDate";
import {
  formatCurrentDay,
  formatCurrentTime,
} from "../../utils/formatCurrentDate";
import { Date, DateContainer } from "./styled";

export const CurrentDate = () => {
  const currentDate = useCurrentDate();

  return (
    <DateContainer>
      <Date $description>Dzisiaj jest {formatCurrentDay(currentDate)},</Date>
      <Date>{formatCurrentTime(currentDate)}</Date>
    </DateContainer>
  );
};
