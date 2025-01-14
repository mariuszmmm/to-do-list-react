import { useDispatch, useSelector } from "react-redux";
import { selectEditListName, setEditListName, setListName } from "../../tasksSlice";
import { Input } from "../../../../common/Input";
import { useRef, useState } from "react";
import Button from "../../../../common/Button";
import { NameContainer } from "./styled";
import { SubTitle } from "../../../../common/SubTitle";
import { saveListNameInLocalStorage } from "../../../../utils/localStorage";

export const Name = ({ content }) => {
  const [name, setName] = useState(content);
  const editListName = useSelector(selectEditListName);
  const inpurRef = useRef(null);
  const dispatch = useDispatch();

  const onNameSubmit = (event) => {
    event.preventDefault();

    const trimedContent = name.trim();
    if (trimedContent || !editListName) {
      dispatch(setListName(trimedContent))
      saveListNameInLocalStorage(trimedContent);
      dispatch(setEditListName())
    } else {
      inpurRef.current.focus();
    }
  };

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
        content && <SubTitle>{content}</SubTitle>
      }
      <Button forName>
        {editListName ? "Zapisz" : "Edytuj"}
      </Button>
    </NameContainer>
  );
}