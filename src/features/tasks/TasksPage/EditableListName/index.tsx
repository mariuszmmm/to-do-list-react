import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { Input } from "../../../../common/Input";
import { NameContainer } from "./styled";
import { ListName } from "./ListName";
import { Button } from "../../../../common/Button";
import {
  selectListNameToEdit,
  selectTaskListMetaData,
  setListNameToEdit,
  setListName,
  selectTasks,
  selectLastSyncedAt,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../../common/StyledList";
import i18n from "../../../../utils/i18n";
import { formatCurrentDate } from "../../../../utils/formatCurrentDate";
import { ListsData } from "../../../../types";

type Props = {
  listsData?: ListsData;
};

export const EditableListName = ({ listsData }: Props) => {
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const name = taskListMetaData.name;
  const lastSyncedAt = useAppSelector(selectLastSyncedAt);
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const [newName, setNewName] = useState(name || t("tasks.defaultListName"));
  const listNameToEdit = useAppSelector(selectListNameToEdit);
  const inpurRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!name) return;
    dispatch(setListName({ name: t("tasks.defaultListName") }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNameSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const trimedContent = newName.trim();

    if (trimedContent) {
      if (!!listNameToEdit) {
        dispatch(
          setListName({
            name: trimedContent,
            stateForUndo: { tasks, taskListMetaData },
          }),
        );
        dispatch(setListNameToEdit(null));

        setNewName(trimedContent);
      } else {
        dispatch(
          setListNameToEdit(name),
        );
        setNewName(name);
      }
    } else {
      inpurRef.current!.focus();
    }
  };

  return (
    <NameContainer onSubmit={onNameSubmit}>
      {!listNameToEdit ? (
        <>
          <StyledSpan $comment>
            {`${t("tasks.listFrom")}:  ${formatCurrentDate(new Date(taskListMetaData.date), i18n.language)}`}
          </StyledSpan>
          <ListName>
            {name}
          </ListName>
        </>
      ) : (
        <Input
          type="text"
          value={newName}
          placeholder={t("tasks.inputPlaceholder")}
          onChange={({ target }) => setNewName(target.value)}
          autoFocus
          ref={inpurRef}
        />
      )}
      <Button $special
        disabled={!listsData && !!lastSyncedAt}>
        {!listNameToEdit
          ? t("tasks.buttons.titleButtons.change")
          : t("tasks.buttons.titleButtons.save")}
      </Button>
    </NameContainer>
  );
};
