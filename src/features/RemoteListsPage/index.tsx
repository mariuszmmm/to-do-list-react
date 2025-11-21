import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { useUpdateListsMutation } from "../../hooks/useUpdateListsMutation";
import { useRemoveListMutation } from "../../hooks/useRemoveListMutation";
import { ListsData } from "../../types";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { TasksListView } from "../../common/TasksListView";
import { ListsButtons } from "./ListsButtons";
import { TaskLists } from "./TaskLists";
import {
  selectSelectedListId,
  selectListToRemove,
  selectListToSort,
  setListToRemove,
  setListToSort,
  selectIsListsSorting,
  selectList,
} from "./remoteListsSlice";
import {
  closeModal,
  openModal,
  selectModalConfirmed,
  selectModalIsOpen,
} from "../../Modal/modalSlice";
import { selectTaskListMetaData, setListStatus } from "../tasks/tasksSlice";
import { getOrCreateDeviceId } from "../../utils/deviceId";

type Props = { listsData: ListsData, localListId: string };

const RemoteListsPage = ({ listsData, localListId }: Props) => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const modalIsOpen = useAppSelector(selectModalIsOpen);
  const confirmed = useAppSelector(selectModalConfirmed);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const listsToSort = useAppSelector(selectListToSort);
  const listToRemove = useAppSelector(selectListToRemove);
  const updateListsMutation = useUpdateListsMutation();
  const removeListMutation = useRemoveListMutation();
  const lists = listsToSort || listsData?.lists;
  const areListsEmpty = !listsData || listsData.lists.length === 0;
  const selectedListById =
    lists.find(({ id }) => id === selectedListId) || null;
  const dispatch = useAppDispatch();
  const { id: taskListId } = useAppSelector(selectTaskListMetaData);
  const deviceId = getOrCreateDeviceId();
  const { t } = useTranslation("translation", {
    keyPrefix: "remoteListsPage",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!listsData) return;
    if (isListsSorting) {
      dispatch(setListToSort(listsData.lists));
    } else {
      if (!listsToSort) return;
      updateListsMutation.mutate({ listsToSort, deviceId });
      dispatch(setListToSort(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListsSorting]);


  useEffect(() => {
    if (!listToRemove) return;
    if (confirmed) {
      removeListMutation.mutate({
        version: listToRemove.version,
        listId: listToRemove.id,
        deviceId
      });

      if (taskListId === listToRemove.id) dispatch(setListStatus({}));
      dispatch(selectList(null));
      dispatch(setListToRemove(null));
    } else {
      if (confirmed === false) {
        dispatch(setListToRemove(null));
        dispatch(closeModal());
        return;
      }
      dispatch(
        openModal({
          title: { key: "modal.listRemove.title" },
          message: {
            key: "modal.listRemove.message.confirm",
            values: { name: listToRemove.name },
          },
          type: "confirm",
          confirmButton: { key: "modal.buttons.deleteButton" },
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listToRemove, confirmed]);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={areListsEmpty ? t("lists.empty") : t("lists.select")}
        body={
          <TaskLists
            lists={lists}
            selectedListId={selectedListId}
            modalIsOpen={modalIsOpen}
            isListsSorting={isListsSorting}
            listsToSort={listsToSort}
            localListId={localListId}
          />
        }
        extraHeaderContent={
          <ListsButtons lists={lists} selectedListById={selectedListById} />
        }
      />
      {selectedListById && !isListsSorting && (
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

export default RemoteListsPage;
