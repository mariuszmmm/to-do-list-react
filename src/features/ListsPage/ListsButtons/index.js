import { useDispatch, useSelector } from "react-redux";
import Button from "../../../common/Button";
import Redo from "../../../common/extraButtons/Redo";
import Undo from "../../../common/extraButtons/Undo";
import ButtonsContainer from "../../../common/ButtonsContainer";
import { redoLists, selectRedoListsStack, selectSelectedListById, selectSelectedListId, selectUndoListsStack, selectUndoTasksStack, setListToLoad, undoLists } from "../listsSlice";
import { StyledLink } from "./styled";

const ListsButtons = () => {
  const undoListsStack = useSelector(selectUndoListsStack);
  const redoListsStack = useSelector(selectRedoListsStack);
  const selectedListId = useSelector(selectSelectedListId);
  const listToLoad = useSelector(state => selectSelectedListById(state, selectedListId));
  const dispatch = useDispatch();

  return (
    <ButtonsContainer>
      <>
        <StyledLink to={`/zadania`}>
          <Button
            onClick={() => dispatch(setListToLoad(listToLoad))}
            disabled={selectedListId === null}
          >
            Pobierz do listy zadań
          </Button>
        </StyledLink>
        <ButtonsContainer sub>
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