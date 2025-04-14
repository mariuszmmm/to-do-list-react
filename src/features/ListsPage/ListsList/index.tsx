import { ArrowDownIcon, ArrowUpIcon } from "../../../common/icons";
import {
  RemoveButton,
  SortButton,
  ToggleButton,
} from "../../../common/taskButtons";
import { SortButtonsContainer } from "../../../common/taskButtons/SortButtonsContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { selectModalIsOpen } from "../../../Modal/modalSlice";
import {
  listMoveDown,
  listMoveUp,
  removeListRequest,
  selectIsListsSorting,
  selectList,
  selectLists,
  selectSelectedListId,
} from "../listsSlice";
import { List, Item, Content, Task } from "./styled";

export const ListsList = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const lists = useAppSelector(selectLists);
  const modalIsOpen = useAppSelector(selectModalIsOpen);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const dispatch = useAppDispatch();

  return (
    <List>
      {lists?.map((list, index) => (
        <Item
          key={list.id}
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() => dispatch(selectList(list.id))}
        >
          {isListsSorting ? (
            <SortButtonsContainer>
              <SortButton
                onClick={() => dispatch(listMoveUp(index))}
                disabled={index === 0}
              >
                <ArrowUpIcon />
              </SortButton>
              <SortButton
                onClick={() => dispatch(() => dispatch(listMoveDown(index)))}
                disabled={index === lists.length - 1}
              >
                <ArrowDownIcon />
              </SortButton>
            </SortButtonsContainer>
          ) : (
            <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
          )}
          <Content>
            <Task>{list.name}</Task>
          </Content>
          <RemoveButton
            onClick={() =>
              dispatch(
                removeListRequest({ listId: list.id, listName: list.name })
              )
            }
            disabled={modalIsOpen}
          >
            🗑️
          </RemoveButton>
        </Item>
      ))}
    </List>
  );
};
