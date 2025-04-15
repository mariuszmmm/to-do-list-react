import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import {
  selectFetchStatus,
  fetchExampleTasks,
  selectAreTasksEmpty,
  removeTasks,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import { getWidthForFetchExampleTasksButton } from "../../../../utils/getWidthForDynamicButtons";

export const TaskFormButtons = () => {
  const fetchStatus = useAppSelector(selectFetchStatus);
  const areTasksEmpty = useAppSelector(selectAreTasksEmpty);
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(fetchExampleTasks())}
        disabled={
          fetchStatus === "loading" || fetchStatus === "error" || !areTasksEmpty
        }
        $error={fetchStatus === "error"}
        width={getWidthForFetchExampleTasksButton(i18n.language)}
      >
        {fetchStatus === "ready"
          ? t("form.buttons.fetchExampleTasks")
          : fetchStatus === "loading"
          ? t("form.buttons.loading")
          : t("form.buttons.error")}
      </Button>
      <Button onClick={() => dispatch(removeTasks())} disabled={areTasksEmpty}>
        {t("tasks.buttons.clear")}
      </Button>
    </ButtonsContainer>
  );
};
