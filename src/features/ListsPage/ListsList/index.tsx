import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useUpdateListsMutation } from "./useUpdateListsMutation";
import { useRemoveListMutation } from "./useRemoveListMutation";
import { moveListDown, moveListUp } from "./moveList";
import { ListsData } from "../../../types";
import { StyledList, Item, Content, Task } from "./styled";
import { ArrowDownIcon, ArrowUpIcon } from "../../../common/icons";
import {
  RemoveButton,
  SortButton,
  ToggleButton,
} from "../../../common/taskButtons";
import { SortButtonsContainer } from "../../../common/taskButtons/SortButtonsContainer";
import {
  closeModal,
  openModal,
  selectModalConfirmed,
  selectModalIsOpen,
} from "../../../Modal/modalSlice";
import {
  selectIsListsSorting,
  selectList,
  selectListToRemove,
  selectListToSort,
  selectSelectedListId,
  setListToRemove,
  setListToSort,
} from "../listsSlice";

type Props = {
  listsData: ListsData;
};

export const ListsList = ({ listsData }: Props) => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const modalIsOpen = useAppSelector(selectModalIsOpen);
  const confirmed = useAppSelector(selectModalConfirmed);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const listsToSort = useAppSelector(selectListToSort);
  const listToRemove = useAppSelector(selectListToRemove);
  const updateListsMutation = useUpdateListsMutation();
  const removeListMutation = useRemoveListMutation();
  const dispatch = useAppDispatch();
  const lists = listsToSort?.lists || listsData?.lists || [];

  useEffect(() => {
    if (!listsData) return;
    if (isListsSorting) {
      dispatch(setListToSort(listsData));
    } else {
      if (!listsToSort) return;
      updateListsMutation.mutate({ listsToSort });
      dispatch(setListToSort(null));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListsSorting]);

  useEffect(() => {
    if (!listToRemove) return;
    if (confirmed) {
      removeListMutation.mutate({
        version: listsData.version,
        listId: listToRemove.id,
      });
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
            values: { listName: listToRemove.name },
          },
          type: "confirm",
          confirmButton: { key: "modal.buttons.deleteButton" },
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listToRemove, confirmed]);

  return (
    <StyledList>
      {lists?.map((list, index) => (
        <Item
          key={list.id}
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() => dispatch(selectList(isListsSorting ? null : list.id))}
        >
          {isListsSorting && listsToSort ? (
            <SortButtonsContainer>
              <SortButton
                onClick={() =>
                  dispatch(setListToSort(moveListUp(index, listsToSort)))
                }
                disabled={index === 0}
              >
                <ArrowUpIcon />
              </SortButton>
              <SortButton
                onClick={() =>
                  dispatch(setListToSort(moveListDown(index, listsToSort)))
                }
                disabled={index === lists.length - 1}
              >
                <ArrowDownIcon />
              </SortButton>
            </SortButtonsContainer>
          ) : (
            <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
          )}
          <Content>
            <Task>{list.name}</Task>
          </Content>
          {!isListsSorting && !listsToSort && (
            <RemoveButton
              onClick={() => dispatch(setListToRemove(list))}
              disabled={modalIsOpen}
            >
              🗑️
            </RemoveButton>
          )}
        </Item>
      ))}
    </StyledList>
  );
};
