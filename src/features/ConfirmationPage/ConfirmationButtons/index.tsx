import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer";

const ConfirmationButtons = () => {
  return (
    <ButtonsContainer>
      <Button onClick={() => window.close()}>Zamknij okno</Button>
    </ButtonsContainer>
  );
};

export default ConfirmationButtons;
