import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import {
  selectAreTasksEmpty,
  removeTasks,
  setTasks,
  selectListName,
  selectTasks,
} from "../../tasksSlice";
import { getWidthForFetchExampleTasksButton } from "../../../../utils/getWidthForDynamicButtons";
import { getExampleTasks } from "../../../../api/getExampleTasks";
import {
  defaultLanguage,
  SupportedLanguages,
  supportedLanguages,
} from "../../../../utils/i18n/languageResources";

export const TaskFormButtons = () => {
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);
  const tasks = useAppSelector(selectTasks);
  const listName = useAppSelector(selectListName);
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const dispatch = useAppDispatch();

  const lang = i18n.language.split("-")[0];
  const langForExample = supportedLanguages.includes(lang as SupportedLanguages)
    ? lang
    : defaultLanguage;

  const { isError, isFetching, refetch } = useQuery({
    queryKey: ["exampleTasks", langForExample],
    queryFn: () => getExampleTasks(langForExample),
    enabled: false,
  });

  const setExampleTasks = async () => {
    const { data, isSuccess } = await refetch();

    if (data && isSuccess) {
      dispatch(
        setTasks({
          tasks: data.tasks,
          listName: data.listName,
          stateForUndo: {
            tasks,
            listName,
          },
        })
      );
    }
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
      <Button onClick={() => dispatch(removeTasks())} disabled={areTasksEmpty}>
        {t("tasks.buttons.clear")}
      </Button>
    </ButtonsContainer>
  );
};
