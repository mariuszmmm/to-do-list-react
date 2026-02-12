import { useEffect } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/redux/redux";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { TasksListView } from "../../common/TasksListView";
import { TaskLists } from "./TaskLists";
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
  const taskListsRef = useRef<HTMLDivElement>(null);
  const previewListRef = useRef<HTMLDivElement>(null);
  const [minPreviewHeight, setMinPreviewHeight] = useState<number>(0);
  const archivedLists = useAppSelector(selectArchivedLists);
  const isArchivedTaskListEmpty = useAppSelector(selectIsArchivedTaskListEmpty);
  const selectedArchivedListId = useAppSelector(selectSelectedArchivedListId);
  const selectedListId = useAppSelector(selectSelectedArchivedListId);
  const modalIsOpen = useAppSelector(selectModalIsOpen);
  const isListsSorting = useAppSelector(selectIsArchivedListsSorting);
  const dispatch = useDispatch();
  const selectedListById = archivedLists.find(({ id }) => id === selectedArchivedListId) || null;

  const { t } = useTranslation("translation", {
    keyPrefix: "archivedListsPage",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    !selectedListId && archivedLists.length > 0 && dispatch(selectArchivedList(archivedLists[0].id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedListId]);

  useEffect(() => {
    let maxListHeight = 0;
    if (previewListRef.current) {
      maxListHeight = previewListRef.current.offsetHeight;
    }
    if (taskListsRef.current && maxListHeight === 0) {
      maxListHeight = taskListsRef.current.offsetHeight;
    }
    const screenHeight = window.innerHeight;
    setMinPreviewHeight(Math.min(maxListHeight, screenHeight - 250));
  }, [archivedLists, isListsSorting, selectedListId]);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={isArchivedTaskListEmpty ? t("lists.empty") : t("lists.select")}
        body={
          <div ref={taskListsRef}>
            <TaskLists
              lists={archivedLists}
              selectedListId={selectedListId}
              selectedListById={selectedListById}
              modalIsOpen={modalIsOpen}
            />
          </div>
        }
      />
      {selectedListById && (
        <>
          <Header title={t("subTitle")} sub />
          <Section
            taskList
            title={selectedListById.name}
            body={
              <div ref={previewListRef} style={{ minHeight: minPreviewHeight }}>
                <TasksListView tasks={selectedListById.taskList} />
              </div>
            }
          />
        </>
      )}
    </>
  );
};

export default ArchivedListsPage;
