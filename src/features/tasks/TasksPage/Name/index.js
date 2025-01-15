import { useDispatch, useSelector } from "react-redux";
import { selectEditListName, selectListName, setEditListName, setListName } from "../../tasksSlice";
import { Input } from "../../../../common/Input";
import { useEffect, useRef, useState } from "react";
import Button from "../../../../common/Button";
import { NameContainer } from "./styled";
import { SubTitle } from "../../../../common/SubTitle";

export const Name = ({ content }) => {
  const listName = useSelector(selectListName);
  const [name, setName] = useState(listName);
  const editListName = useSelector(selectEditListName);
  const inpurRef = useRef(null);
  const dispatch = useDispatch();

  const onNameSubmit = (event) => {
    event.preventDefault();

    const trimedContent = name.trim();
    if (trimedContent || !editListName) {
      dispatch(setListName(trimedContent))
      dispatch(setEditListName())
    } else {
      inpurRef.current.focus();
    }
  };

  useEffect(() => {
    setName(listName)
  }, [listName])

  return (
    <NameContainer onSubmit={onNameSubmit}>
      {editListName
        ?
        <>
          <Input
            type="text"
            value={name}
            placeholder="Wpisz nazwę"
            onChange={({ target }) => setName(target.value)}
            autoFocus
            ref={inpurRef}
          />
        </>
        :
        listName && <SubTitle>{listName}</SubTitle>
      }
      <Button forName>
        {editListName ? "Zapisz nazwę" : "Edytuj nazwę listy"}
      </Button>
    </NameContainer>
  );
}