import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer";
import { StyledLink } from "../../../common/StyledLink";

const ConfirmationButtons = () => {
  return (
    <ButtonsContainer>
      <StyledLink to={`/konto`}>
        <Button>Zaloguj</Button>
      </StyledLink>
    </ButtonsContainer>
  );
};

export default ConfirmationButtons;
