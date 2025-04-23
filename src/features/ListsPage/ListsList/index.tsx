import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "../../../common/icons";
import {
  RemoveButton,
  SortButton,
  ToggleButton,
} from "../../../common/taskButtons";
import { SortButtonsContainer } from "../../../common/taskButtons/SortButtonsContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  selectModalConfirmed,
  selectModalIsOpen,
} from "../../../Modal/modalSlice";
import {
  removeListRequest,
  selectIsListsSorting,
  selectList,
  selectSelectedListId,
} from "../listsSlice";
import { StyledList, Item, Content, Task } from "./styled";
import { List, Version } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { selectLoggedUserEmail } from "../../AccountPage/accountSlice";
import { refreshData } from "../../../utils/refreshData";
import { moveListDown, moveListUp } from "./moveList";
import { useUpdateListsMutation } from "./useUpdateListsMutation";

export const ListsList = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const modalIsOpen = useAppSelector(selectModalIsOpen);
  const confirmed = useAppSelector(selectModalConfirmed);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const [listToSort, setListToSort] = useState<{
    lists: List[];
    version: Version;
  } | null>(null);

  const { data } = useQuery<{
    lists: List[];
    version: Version;
  }>({
    queryKey: ["lists"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
  });

  const updateListsMutation = useUpdateListsMutation({
    confirmed,
    setListToSort,
  });

  useEffect(() => {
    if (!data) return;
    if (isListsSorting) {
      setListToSort(data);
    } else {
      if (!listToSort) return;
      updateListsMutation.mutate({ listToSort, force: confirmed });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListsSorting, confirmed]);

  const lists = listToSort?.lists || data?.lists || [];

  return (
    <StyledList>
      {lists?.map((list, index) => (
        <Item
          key={list.id}
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() => dispatch(selectList(isListsSorting ? null : list.id))}
        >
          {isListsSorting && listToSort ? (
            <SortButtonsContainer>
              <SortButton
                onClick={() => moveListUp(index, listToSort, setListToSort)}
                disabled={index === 0}
              >
                <ArrowUpIcon />
              </SortButton>
              <SortButton
                onClick={() => moveListDown(index, listToSort, setListToSort)}
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
          <RemoveButton
            onClick={() =>
              dispatch(
                removeListRequest({ listId: list.id, listName: list.name })
              )
            }
            disabled={modalIsOpen}
          >
            🗑️
          </RemoveButton>
        </Item>
      ))}
    </StyledList>
  );
};
