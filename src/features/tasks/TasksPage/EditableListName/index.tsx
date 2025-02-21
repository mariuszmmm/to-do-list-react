import { FormEventHandler, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { Input } from "../../../../common/Input";
import { NameContainer } from "./styled";
import { ListName } from "./ListName";
import { Button } from "../../../../common/Button";
import {
  selectListNameToEdit,
  selectListName,
  setListNameToEdit,
  setListName,
  selectTasks,
} from "../../tasksSlice";

export const EditableListName = () => {
  const tasks = useAppSelector(selectTasks);
  const listName = useAppSelector(selectListName);
  const [name, setName] = useState(listName);
  const listNameToEdit = useAppSelector(selectListNameToEdit);
  const inpurRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const onNameSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const trimedContent = name.trim();
    if (trimedContent) {
      if (listNameToEdit !== null) {
        dispatch(
          setListName({
            listName: trimedContent,
            stateForUndo: { tasks, listName },
          })
        );
        dispatch(setListNameToEdit(null));

        setName(trimedContent);
      } else {
        dispatch(setListNameToEdit(listName));
        setName(listName);
      }
    } else {
      inpurRef.current!.focus();
    }
  };

  return (
    <NameContainer onSubmit={onNameSubmit}>
      {listNameToEdit === null ? (
        listName && <ListName>{listName}</ListName>
      ) : (
        <Input
          type="text"
          value={name}
          placeholder="Wpisz nazwę"
          onChange={({ target }) => setName(target.value)}
          autoFocus
          ref={inpurRef}
        />
      )}
      <Button $special>{listNameToEdit === null ? "Zmień" : "Zapisz"}</Button>
    </NameContainer>
  );
};
