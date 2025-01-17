import { useDispatch, useSelector } from "react-redux";
import { selectListNameToEdit, selectListName, setListNameToEdit, setListName, selectTasks } from "../../tasksSlice";
import { Input } from "../../../../common/Input";
import { useEffect, useRef, useState } from "react";
import Button from "../../../../common/Button";
import { NameContainer } from "./styled";
import { SubTitle } from "../../../../common/SubTitle";

export const Name = () => {
  const tasks = useSelector(selectTasks);
  const listName = useSelector(selectListName);
  const [name, setName] = useState(listName);
  const listNameToEdit = useSelector(selectListNameToEdit);
  const inpurRef = useRef(null);
  const dispatch = useDispatch();

  const onNameSubmit = (event) => {
    event.preventDefault();

    const trimedContent = name.trim();
    if (trimedContent || listNameToEdit === null) {
      if (listNameToEdit !== null) dispatch(setListName({ listName: trimedContent, stateForUndo: { tasks, listName } }));
      dispatch(setListNameToEdit(listNameToEdit === null ? listName : null))
    } else {
      inpurRef.current.focus();
    }
  };

  useEffect(() => {
    setName(listName)
  }, [listName])

  return (
    <NameContainer onSubmit={onNameSubmit}>
      {listNameToEdit === null
        ?
        listName && <SubTitle>{listName}</SubTitle>
        :
        <Input
          type="text"
          value={name}
          placeholder="Wpisz nazwę"
          onChange={({ target }) => setName(target.value)}
          autoFocus
          ref={inpurRef}
        />
      }
      <Button forName>
        {listNameToEdit === null ? "Edytuj nazwę listy" : "Zapisz nazwę"}
      </Button>
    </NameContainer>
  );
}