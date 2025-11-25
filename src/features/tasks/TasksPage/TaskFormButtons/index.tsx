import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../common/Button";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { StyledLink } from "../../../../common/StyledLink";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { getExampleTasks } from "../../../../api/getExampleTasks";
import { getWidthForFetchExampleTasksButton } from "../../../../utils/getWidthForDynamicButtons";
import {
  defaultLanguage,
  SupportedLanguages,
  supportedLanguages,
} from "../../../../utils/i18n/languageResources";
import {
  selectAreTasksEmpty,
  selectTaskListMetaData,
  selectTasks,
  setLastSyncedAt,
  setTasks,
} from "../../tasksSlice";
import { selectIsArchivedTaskListEmpty } from "../../../ArchivedListPage/archivedListsSlice";
import { TaskListData } from "../../../../types";

export const TaskFormButtons = () => {
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const isArchivedTaskListEmpty = useAppSelector(selectIsArchivedTaskListEmpty);
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const dispatch = useAppDispatch();

  const lang = i18n.language.split("-")[0];
  const langForExample = supportedLanguages.includes(lang as SupportedLanguages)
    ? lang
    : defaultLanguage;

  const { isError, isFetching, refetch } = useQuery<TaskListData>({
    queryKey: ["exampleTasks", langForExample],
    queryFn: () => getExampleTasks(langForExample),
    enabled: false,
  });

  const setExampleTasks = async () => {
    const { data, isSuccess } = await refetch();

    if (data && isSuccess) {
      dispatch(
        setTasks({
          taskListMetaData: {
            id: data.taskListMetaData.id,
            name: data.taskListMetaData.name,
            date: data.taskListMetaData.date,
          },
          tasks: data.tasks,
          stateForUndo: {
            tasks,
            taskListMetaData,
          },
        }),
      );
    }

    dispatch(setLastSyncedAt());
  };

  return (
    <ButtonsContainer>
      <Button
        onClick={setExampleTasks}
        disabled={isFetching || isError || !areTasksEmpty}
        $error={isError}
        width={getWidthForFetchExampleTasksButton(i18n.language)}
      >
        {!isFetching && !isError
          ? t("form.buttons.fetchExampleTasks")
          : isFetching
            ? t("form.buttons.loading")
            : t("form.buttons.error")}
      </Button>
      <StyledLink to={`/archived-lists`}>
        <Button disabled={isArchivedTaskListEmpty}>Pobierz z archiwum</Button>
      </StyledLink>
    </ButtonsContainer>
  );
};
