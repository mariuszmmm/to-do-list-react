import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer";
import { StyledLink } from "../../../common/StyledLink";

const ConfirmationButtons = ({ leftTime }: { leftTime: number }) => {
  return (
    <ButtonsContainer>
      <StyledLink to={`/konto`}>
        <Button onClick={() => window.close()}>
          {leftTime < 5 ? "Zamknij" : `Zamknięcie za ${leftTime} sek.`}
        </Button>
      </StyledLink>
    </ButtonsContainer>
  );
};

export default ConfirmationButtons;
