import { FormEventHandler, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { Input } from "../../../../common/Input";
import { NameContainer } from "./styled";
import { ListName } from "./ListName";
import { Button } from "../../../../common/Button";
import {
  selectListNameToEdit,
  selectTaskListMetaData,
  setListNameToEdit,
  setListMetadata,
  selectTasks,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";

export const EditableListName = () => {
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const [name, setName] = useState(
    taskListMetaData?.name || t("tasks.defaultListName"),
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
            taskListMetaData: {
              ...taskListMetaData,
              name: trimedContent,
            },
            stateForUndo: { tasks, taskListMetaData },
          }),
        );
        dispatch(setListNameToEdit(null));

        setName(trimedContent);
      } else {
        dispatch(
          setListNameToEdit(
            taskListMetaData?.name || t("tasks.defaultListName"),
          ),
        );
        setName(taskListMetaData?.name || t("tasks.defaultListName"));
      }
    } else {
      inpurRef.current!.focus();
    }
  };

  return (
    <NameContainer onSubmit={onNameSubmit}>
      {listNameToEdit === null ? (
        <ListName>
          {taskListMetaData?.name || t("tasks.defaultListName")}
        </ListName>
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
