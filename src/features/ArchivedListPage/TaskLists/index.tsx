import { List } from "../../../types";
import { useAppDispatch } from "../../../hooks/redux";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledTask,
} from "../../../common/StyledList";
import { RemoveButton, ToggleButton } from "../../../common/taskButtons";
import {
  selectArchivedList,
  setArchivedListToRemove,
} from "../archivedListsSlice";

type Props = {
  lists: List[];
  selectedListId: string | null;
  modalIsOpen: any;
  isListsSorting: boolean;
};

export const TaskLists = ({
  lists,
  selectedListId,
  modalIsOpen,
  isListsSorting,
}: Props) => {
  const dispatch = useAppDispatch();

  return (
    <StyledList>
      {lists?.map((list) => (
        <StyledListItem
          key={list.id}
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() =>
            dispatch(selectArchivedList(isListsSorting ? null : list.id))
          }
          $type={"tasks"}
        >
          <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
          <StyledListContent $type={"tasks"}>
            <StyledTask $ListName>{list.name}</StyledTask>
          </StyledListContent>
          <RemoveButton
            onClick={() => dispatch(setArchivedListToRemove(list))}
            disabled={modalIsOpen}
          >
            🗑️
          </RemoveButton>
        </StyledListItem>
      ))}
    </StyledList>
  );
};
