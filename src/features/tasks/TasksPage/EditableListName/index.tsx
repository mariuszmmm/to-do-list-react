import { FormEventHandler, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { Input } from "../../../../common/Input";
import { NameContainer } from "./styled";
import { ListName } from "./ListName";
import { Button } from "../../../../common/Button";
import {
  selectListNameToEdit,
  selectListMetadata,
  setListNameToEdit,
  setListMetadata,
  selectTasks,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";

export const EditableListName = () => {
  const tasks = useAppSelector(selectTasks);
  const listMetadata = useAppSelector(selectListMetadata);
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const [name, setName] = useState(
    listMetadata?.name || t("tasks.defaultListName")
  );
  const listNameToEdit = useAppSelector(selectListNameToEdit);
  const inpurRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const onNameSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const trimedContent = name.trim();

    if (trimedContent) {
      if (listNameToEdit !== null) {
        dispatch(
          setListMetadata({
            listMetadata: {
              ...listMetadata,
              name: trimedContent,
            },
            stateForUndo: { tasks, listMetadata },
          })
        );
        dispatch(setListNameToEdit(null));

        setName(trimedContent);
      } else {
        dispatch(
          setListNameToEdit(listMetadata?.name || t("tasks.defaultListName"))
        );
        setName(listMetadata?.name || t("tasks.defaultListName"));
      }
    } else {
      inpurRef.current!.focus();
    }
  };

  return (
    <NameContainer onSubmit={onNameSubmit}>
      {listNameToEdit === null ? (
        <ListName>{listMetadata?.name || t("tasks.defaultListName")}</ListName>
      ) : (
        <Input
          type="text"
          value={name}
          placeholder={t("tasks.inputPlaceholder")}
          onChange={({ target }) => setName(target.value)}
          autoFocus
          ref={inpurRef}
        />
      )}
      <Button $special>
        {listNameToEdit === null
          ? t("tasks.buttons.titleButtons.change")
          : t("tasks.buttons.titleButtons.save")}
      </Button>
    </NameContainer>
  );
};
