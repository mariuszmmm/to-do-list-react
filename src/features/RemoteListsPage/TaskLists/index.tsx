import { useAppDispatch } from "../../../hooks/redux";
import { List } from "../../../types";
import { moveListDown, moveListUp } from "../../../utils/moveList";
import { ArrowDownIcon, ArrowUpIcon, CircleIcon } from "../../../common/icons";
import {
  RemoveButton,
  SortButton,
  ToggleButton,
} from "../../../common/taskButtons";
import {
  selectList,
  setListToRemove,
  setListToSort,
} from "../remoteListsSlice";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
  ListMeta,
  ListMetaText,
} from "../../../common/StyledList";
import { formatCurrentDate } from "../../../utils/formatCurrentDate";
import i18n from "../../../utils/i18n";
import { useTranslation } from "react-i18next";

type Props = {
  lists: List[];
  selectedListId: string | null;
  modalIsOpen: boolean;
  isListsSorting: boolean;
  listsToSort: List[] | null;
  localListId: string;
};

export const TaskLists = ({
  lists,
  selectedListId,
  modalIsOpen,
  isListsSorting,
  listsToSort,
  localListId
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <StyledList>
      {lists?.map((list, index) => (
        <StyledListItem
          key={list.id}
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() => !isListsSorting && selectedListId !== list.id && dispatch(selectList(list.id))}
          $type={isListsSorting ? "sort" : "lists"}
        >
          {isListsSorting && listsToSort ?
            <SortButton
              onClick={() =>
                dispatch(setListToSort(moveListUp(index, listsToSort)))
              }
              disabled={index === 0}
            >
              <ArrowUpIcon />
            </SortButton>
            :
            <ToggleButton>
              {selectedListId === list.id ? "✔" : ""}
            </ToggleButton>
          }

          <StyledListContent $type={isListsSorting ? "sort" : "lists"}>
            <StyledSpan $ListName>{list.name}</StyledSpan>
            <br />
            <ListMeta>
              {list.id === localListId && <CircleIcon $isActive />}
              <ListMetaText>
                <StyledSpan $comment>
                  {`${t("listFrom")}:  ${formatCurrentDate(new Date(list.date), i18n.language)} `}
                  {list.taskList.length > 0 && <><strong>•</strong>&nbsp;(&nbsp;{t('currentTaskCount.tasks', { count: list.taskList.length ?? 0 })}&nbsp;)&nbsp;</>}
                  {list.id === localListId && <><strong>•</strong>&nbsp;{t("currentList")}</>}
                </StyledSpan>
              </ListMetaText>
            </ListMeta>
          </StyledListContent>

          {isListsSorting && listsToSort ?
            <SortButton
              onClick={() =>
                dispatch(setListToSort(moveListDown(index, listsToSort)))
              }
              disabled={index === lists.length - 1}
            >
              <ArrowDownIcon />
            </SortButton>
            :
            <RemoveButton
              onClick={(event) => {
                event.stopPropagation();
                dispatch(setListToRemove(list))
              }}
              disabled={modalIsOpen}
            >
              🗑️
            </RemoveButton>
          }
        </StyledListItem>
      ))}
    </StyledList>
  );
};

