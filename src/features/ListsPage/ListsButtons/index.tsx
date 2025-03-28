import { useAppDispatch, useAppSelector } from "../../../hooks";
import { StyledLink } from "../../../common/StyledLink";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectSelectedListById,
  selectSelectedListId,
  setListToLoad,
} from "../listsSlice";

export const ListsButtons = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const listToLoad = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      <StyledLink to={`/zadania`}>
        <Button
          onClick={() => dispatch(setListToLoad(listToLoad))}
          disabled={selectedListId === null}
        >
          Załaduj wybraną listę
        </Button>
      </StyledLink>
    </ButtonsContainer>
  );
};
