import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { TasksListView } from "../../common/TasksListView";
import { TaskLists } from "./TaskLists";
import { ListsButtons } from "./ListsButtons";
import {
  selectArchivedList,
  selectArchivedLists,
  selectIsArchivedListsSorting,
  selectIsArchivedTaskListEmpty,
  selectSelectedArchivedListId,
} from "./archivedListsSlice";
import { selectModalIsOpen } from "../../Modal/modalSlice";
import { useDispatch } from "react-redux";

const ArchivedListsPage = () => {
  const archivedLists = useAppSelector(selectArchivedLists);
  const isArchivedTaskListEmpty = useAppSelector(selectIsArchivedTaskListEmpty);
  const selectedArchivedListId = useAppSelector(selectSelectedArchivedListId);
  const selectedListId = useAppSelector(selectSelectedArchivedListId);
  const modalIsOpen = useAppSelector(selectModalIsOpen);
  const isListsSorting = useAppSelector(selectIsArchivedListsSorting);
  const dispatch = useDispatch();
  const selectedListById =
    archivedLists.find(({ id }) => id === selectedArchivedListId) || null;

  const { t } = useTranslation("translation", {
    keyPrefix: "archivedListsPage",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    !selectedListId && dispatch(selectArchivedList(archivedLists[0].id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={isArchivedTaskListEmpty ? t("lists.empty") : t("lists.select")}
        body={
          <TaskLists
            lists={archivedLists}
            selectedListId={selectedListId}
            modalIsOpen={modalIsOpen}
            isListsSorting={isListsSorting}
          />
        }
        extraHeaderContent={
          <ListsButtons
            lists={archivedLists}
            selectedListById={selectedListById}
          />
        }
      />
      {selectedListById && (
        <>
          <Header title={t("subTitle")} sub />
          <Section
            title={selectedListById.name}
            body={<TasksListView tasks={selectedListById.taskList} />}
          />
        </>
      )}
    </>
  );
};

export default ArchivedListsPage;
