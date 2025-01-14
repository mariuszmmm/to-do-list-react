import { useDispatch, useSelector } from "react-redux";
import Button from "../../../common/Button";
import Redo from "../../../common//extraButtons/Redo";
import Undo from "../../../common/extraButtons/Undo";
import ButtonsContainer from "../../../common/ButtonsContainer";
import { redo, selectRedoStack, selectSelectedListById, selectSelectedListId, selectUndoStack, setListToDownload, undo } from "../listsSlice";
import { StyledLink } from "./styled";

const ListsButtons = () => {
  const undoStack = useSelector(selectUndoStack);
  const redoStack = useSelector(selectRedoStack);
  const selectedListId = useSelector(selectSelectedListId);
  const listToDownload = useSelector(state => selectSelectedListById(state, selectedListId));
  const dispatch = useDispatch();

  return (
    <ButtonsContainer>
      <>
        <StyledLink to={`/zadania`}>
          <Button
            onClick={() => dispatch(setListToDownload(listToDownload))}
            disabled={selectedListId === null}
          >
            Pobierz listę
          </Button>
        </StyledLink>
        <ButtonsContainer>
          <Button
            disabled={undoStack.length === 0}
            onClick={() => dispatch(undo())}
            title={undoStack.length === 0 ? "" : "Cofnij"}
          >
            <Undo />
          </Button>
          <Button
            disabled={redoStack.length === 0}
            onClick={() => dispatch(redo())}
            title={redoStack.length === 0 ? "" : "Ponów"}
          >
            <Redo />
          </Button>
        </ButtonsContainer>
      </>
    </ButtonsContainer>
  );
};

export default ListsButtons;