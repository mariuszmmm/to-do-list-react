import { useDispatch, useSelector } from "react-redux";
import { removeList, selectList, selectLists, selectSelectedListId } from "../listsSlice";
import { List, Item, ToggleButton, Content, Task, RemoveButton } from "./styled";

const ListsList = () => {
  const selectedListId = useSelector(selectSelectedListId);
  const lists = useSelector(selectLists);
  const dispatch = useDispatch();

  return (
    <List >
      {lists.map((list) => (
        <Item
          key={list.id}
          selected={selectedListId === list.id}
        >
          <ToggleButton
            onClick={() => dispatch(selectList(list.id))}
          >
            {selectedListId === list.id ? "✔" : ""}
          </ToggleButton>
          <Content
            onClick={() => dispatch(selectList(list.id))}
          >
            <Task>{list.name}</Task>
          </Content>
          <RemoveButton
            onClick={() => dispatch(removeList({ listId: list.id, lastLists: lists }))}
          >
            🗑️
          </RemoveButton>
        </Item>
      ))}
    </List>
  );
};

export default ListsList;