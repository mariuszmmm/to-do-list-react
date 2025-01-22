import { useState } from "react";
import { useRef } from "react";
import { Button, StyledForm } from "./styled";
import { Input } from "../../../common/Input";


const LogForm = () => {
  // const editedTask = useSelector(selectEditedTask)
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const loginInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  // const dispatch = useDispatch();
  // const replaceQueryParameter = useReplaceQueryParameter();
  // const formatedDate = formatCurrentDate(new Date());

  const onFormSubmit = (event) => {
    //   event.preventDefault();

    //   editedTask === null && replaceQueryParameter({
    //     key: searchQueryParamName,
    //   });

    //   const trimmedTaskContent = taskContent.trim();

    //   if (trimmedTaskContent) {
    //     editedTask === null ?
    //       dispatch(addTask({
    //         content: trimmedTaskContent,
    //         done: false,
    //         id: nanoid(),
    //         date: formatedDate,
    //       }))
    //       :
    //       dispatch(saveEditedTask({
    //         id: editedTask.id,
    //         content: trimmedTaskContent,
    //         editedDate: formatedDate,
    //       }))
  };

  //   setTaskContent("");
  //   editedTask === null && inputRef.current.focus();
  //   inputRef.current.scrollLeft = inputRef.current.scrollWidth;
  // };

  // useEffect(() => {
  //   inputRef.current.scrollLeft = inputRef.current.scrollWidth;
  // }, [taskContent]);

  // useEffect(() => {
  //   if (editedTask !== null) {
  //     setTaskContent(editedTask.content);
  //     inputRef.current.focus();
  //   }
  // }, [editedTask]);

  return (
    <StyledForm onSubmit={onFormSubmit}>
      <Input
        autoFocus
        value={login}
        name="login"
        placeholder="name@poczta.pl"
        onChange={({ target }) => setLogin(target.value)}
        ref={loginInputRef}
      />
      <Input
        value={password}
        name="password"
        placeholder="hasło"
        onChange={({ target }) => setPassword(target.value)}
        ref={passwordInputRef}
      />
      <Button>
        Zaloguj
      </Button>
    </StyledForm>
  )
};

export default LogForm;