import {
  removeList,
  selectList,
  selectLists,
  selectSelectedListId,
} from "../listsSlice";
import {
  List,
  Item,
  ToggleButton,
  Content,
  Task,
  RemoveButton,
} from "./styled";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

const ListsList = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const lists = useAppSelector(selectLists);
  const dispatch = useAppDispatch();

  return (
    <List>
      {lists.map((list) => (
        <Item key={list.id} selected={selectedListId === list.id}>
          <ToggleButton onClick={() => dispatch(selectList(list.id))}>
            {selectedListId === list.id ? "✔" : ""}
          </ToggleButton>
          <Content onClick={() => dispatch(selectList(list.id))}>
            <Task>{list.name}</Task>
          </Content>
          <RemoveButton
            onClick={() =>
              dispatch(removeList({ listId: list.id, lastLists: lists }))
            }
          >
            🗑️
          </RemoveButton>
        </Item>
      ))}
    </List>
  );
};

export default ListsList;
