import Button from "../../../common/Button";
import Redo from "../../../common/buttonIcons/Redo";
import Undo from "../../../common/buttonIcons/Undo";
import ButtonsContainer from "../../../common/ButtonsContainer";
import {
  redoLists,
  selectRedoListsStack,
  selectSelectedListById,
  selectSelectedListId,
  selectUndoListsStack,
  setListToLoad,
  undoLists,
} from "../listsSlice";
import { StyledLink } from "./styled";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const ListsButtons = () => {
  const undoListsStack = useAppSelector(selectUndoListsStack);
  const redoListsStack = useAppSelector(selectRedoListsStack);
  const selectedListId = useAppSelector(selectSelectedListId);
  const listToLoad = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      <>
        <StyledLink to={`/zadania`}>
          <Button
            onClick={() => listToLoad && dispatch(setListToLoad(listToLoad))}
            disabled={selectedListId === null}
          >
            Pobierz do listy zadań
          </Button>
        </StyledLink>
        <ButtonsContainer $sub>
          <Button
            disabled={undoListsStack.length === 0}
            onClick={() => dispatch(undoLists())}
            title={undoListsStack.length === 0 ? "" : "Cofnij"}
          >
            <Undo />
          </Button>
          <Button
            disabled={redoListsStack.length === 0}
            onClick={() => dispatch(redoLists())}
            title={redoListsStack.length === 0 ? "" : "Ponów"}
          >
            <Redo />
          </Button>
        </ButtonsContainer>
      </>
    </ButtonsContainer>
  );
};

export default ListsButtons;
