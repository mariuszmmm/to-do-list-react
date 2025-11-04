import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";
import { DateInfo, Name } from "./styled";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { selectTaskById } from "../tasksSlice";
import { formatCurrentDate } from "../../../utils/formatCurrentDate";
import { useTranslation } from "react-i18next";

const TaskPage = () => {
  const { id } = useParams();
  const task = useAppSelector((state) =>
    id ? selectTaskById(state, id) : null,
  );
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "taskPage",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={task ? task.content : t("noContent")}
        body={
          task && (
            <>
              <DateInfo>
                <Name>{t("done.title")}:</Name>
                {task.done ? t("done.yes") : t("done.no")}
              </DateInfo>
              <DateInfo>
                <Name>{t("dateCreated")}:</Name>
                {formatCurrentDate(new Date(task.date), i18n.language)}
              </DateInfo>
              {task.editedDate && (
                <DateInfo>
                  <Name>{t("dateEdited")}:</Name>
                  {formatCurrentDate(new Date(task.editedDate), i18n.language)}
                </DateInfo>
              )}
              {task.done && task.doneDate && (
                <DateInfo>
                  <Name>{t("dateDone")}:</Name>
                  {formatCurrentDate(new Date(task.doneDate), i18n.language)}
                </DateInfo>
              )}
            </>
          )
        }
      />
    </>
  );
};

export default TaskPage;
