import { RemoveButton, ToggleButton } from "../../../common/taskButtons";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { selectModalIsOpen } from "../../../Modal/modalSlice";
import {
  removeListRequest,
  selectList,
  selectLists,
  selectSelectedListId,
} from "../listsSlice";
import { List, Item, Content, Task } from "./styled";

export const ListsList = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const lists = useAppSelector(selectLists);
  const modalIsOpen = useAppSelector(selectModalIsOpen);
  const dispatch = useAppDispatch();

  return (
    <List>
      {lists?.map((list) => (
        <Item
          key={list.id}
          selected={selectedListId === list.id}
          onClick={() => dispatch(selectList(list.id))}
        >
          <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
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
