import { useAppDispatch } from "../../../hooks/redux";
import { List } from "../../../types";
import { moveListDown, moveListUp } from "../../../utils/moveList";
import { ArrowDownIcon, ArrowUpIcon } from "../../../common/icons";
import {
  RemoveButton,
  SortButton,
  SortButtonsContainer,
  ToggleButton,
} from "../../../common/taskButtons";
import {
  selectList,
  setListToRemove,
  setListToSort,
} from "../remoteListsSlice";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledTask,
} from "../../../common/StyledList";
import { formatCurrentDate } from "../../../utils/formatCurrentDate";
import i18n from "../../../utils/i18n";

type Props = {
  lists: List[];
  selectedListId: string | null;
  modalIsOpen: boolean;
  isListsSorting: boolean;
  listsToSort: List[] | null;
};

export const TaskLists = ({
  lists,
  selectedListId,
  modalIsOpen,
  isListsSorting,
  listsToSort,
}: Props) => {
  const dispatch = useAppDispatch();

  return (
    <StyledList>
      {lists?.map((list, index) => (
        <StyledListItem
          key={list.id}
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() => dispatch(selectList(isListsSorting ? null : list.id))}
          $type={"tasks"}
        >
          {isListsSorting && listsToSort ? (
            <SortButtonsContainer>
              <SortButton
                onClick={() =>
                  dispatch(setListToSort(moveListUp(index, listsToSort)))
                }
                disabled={index === 0}
              >
                <ArrowUpIcon />
              </SortButton>
              <SortButton
                onClick={() =>
                  dispatch(setListToSort(moveListDown(index, listsToSort)))
                }
                disabled={index === lists.length - 1}
              >
                <ArrowDownIcon />
              </SortButton>
            </SortButtonsContainer>
          ) : (
            <ToggleButton>
              {selectedListId === list.id ? "✔" : ""}
            </ToggleButton>
          )}
          <StyledListContent $type={"tasks"}>
            <StyledTask $ListName>{list.name}</StyledTask>
            <br />
            <StyledTask
              $comment
            >{`(${formatCurrentDate(new Date(list.date), i18n.language)})`}</StyledTask>
          </StyledListContent>
          {!isListsSorting && !listsToSort && (
            <RemoveButton
              onClick={() => dispatch(setListToRemove(list))}
              disabled={modalIsOpen}
            >
              🗑️
            </RemoveButton>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};
