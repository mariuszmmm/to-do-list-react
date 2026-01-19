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
  selectEditedTask,
  selectIsTasksSorting,
  selectTaskListMetaData,
  selectTasks,
  setTasks,
} from "../../tasksSlice";
import { selectIsArchivedTaskListEmpty } from "../../../ArchivedListPage/archivedListsSlice";
import { Task } from "../../../../types";
import { nanoid } from "nanoid";

export const AddTasksButtons = () => {
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const isArchivedTaskListEmpty = useAppSelector(selectIsArchivedTaskListEmpty);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const editedTask = useAppSelector(selectEditedTask);
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const dispatch = useAppDispatch();

  const lang = i18n.language.split("-")[0];
  const langForExample = supportedLanguages.includes(lang as SupportedLanguages)
    ? lang
    : defaultLanguage;

  const { isError, isFetching, refetch } = useQuery<{ name: string, tasks: Task[] }>({
    queryKey: ["exampleTasks", langForExample],
    queryFn: () => getExampleTasks(langForExample),
    enabled: false,
  });

  const setExampleTasks = async () => {
    const { data, isSuccess } = await refetch();
    const time = new Date().toISOString();

    if (data && isSuccess) {
      const dataTasks = data.tasks.map((task) => ({
        ...task,
        status: "new" as const,
      }));

      dispatch(
        setTasks({
          taskListMetaData: {
            id: nanoid(),
            name: data.name,
            date: time,
            updatedAt: time,
            synced: false,
          },
          tasks: dataTasks,
          stateForUndo: {
            tasks,
            taskListMetaData,
          },
        }),
      );
    }
  };

  return (
    <ButtonsContainer>
      <StyledLink to={`/archived-lists`}>
        <Button disabled={isArchivedTaskListEmpty || !!editedTask || isTasksSorting}>
          {t("form.buttons.loadFromArchive")}
        </Button>
      </StyledLink>
      <Button
        onClick={setExampleTasks}
        disabled={isFetching || isError || !areTasksEmpty || !!editedTask || isTasksSorting}
        $error={isError}
        width={getWidthForFetchExampleTasksButton(i18n.language)}
      >
        {!isFetching && !isError
          ? t("form.buttons.fetchExampleTasks")
          : isFetching
            ? t("form.buttons.loading")
            : t("form.buttons.error")}
      </Button>
    </ButtonsContainer>
  );
};
