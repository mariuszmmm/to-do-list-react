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
  selectTime,
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
  const synchonizedTime = useAppSelector(selectTime)?.synchronizedTime;
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
        <>
          <StyledSpan $comment>
            {`Lista z dnia:  ${formatCurrentDate(new Date(taskListMetaData.date), i18n.language)}`}
          </StyledSpan>
          <ListName>
            {taskListMetaData?.name || t("tasks.defaultListName")}
          </ListName>
        </>
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
      <Button $special
        disabled={!listsData && !!synchonizedTime}>
        {listNameToEdit === null
          ? t("tasks.buttons.titleButtons.change")
          : t("tasks.buttons.titleButtons.save")}
      </Button>
    </NameContainer>
  );
};
