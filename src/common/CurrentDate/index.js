import { useCurrentDate } from "./useCurrentDate";
import {
  formatCurrentDay,
  formatCurrentTime,
} from "../../utils/formatCurrentDate";
import { Date, ContainerDate } from "./styled";

const CurrentDate = () => {
  const currentDate = useCurrentDate();

  return (
    <ContainerDate>
      <Date $description>Dzisiaj jest {formatCurrentDay(currentDate)},</Date>
      <Date>{formatCurrentTime(currentDate)}</Date>
    </ContainerDate>
  );
};

export default CurrentDate;
