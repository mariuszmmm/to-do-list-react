import type { DraggableAttributes } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpIcon, CircleIcon } from "../../../common/icons";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
  ListMeta,
  ListMetaText,
} from "../../../common/StyledList";
import {
  RemoveButton,
  SortButton,
  ToggleButton,
} from "../../../common/taskButtons";
import { useAppDispatch } from "../../../hooks/redux";
import { useDndList } from "../../../hooks/useDndList";
import { useDndItem } from "../../../hooks/useDndItem";
import { List } from "../../../types";
import { formatCurrentDate } from "../../../utils/formatCurrentDate";
import { moveListDown, moveListUp } from "../../../utils/moveList";
import i18n from "../../../utils/i18n";
import {
  selectList,
  setListToRemove,
  setListToSort,
} from "../remoteListsSlice";
import { useSortableRowAnimation } from "../../../hooks/useSortableRowAnimation";

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
  localListId,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sortableLists = listsToSort ?? lists;

  const { withDnd } = useDndList({
    items: sortableLists,
    isSorting: isListsSorting && !!listsToSort,
    getId: (l) => l.id,
    onReorder: (next) => dispatch(setListToSort(next)),
  });

  const SortableListRow = ({ list, index }: { list: List; index: number }) => {
    const { dragProps } = useDndItem(list.id, true);
    const { setRefs, animateMove, isAnimating } = useSortableRowAnimation({
      index,
      list: listsToSort,
      setList: (next: List[]) => dispatch(setListToSort(next)),
      moveUp: moveListUp,
      moveDown: moveListDown,
    });
    const combinedRef = (el: HTMLLIElement | null) => {
      setRefs(el);
      dragProps.setNodeRef(el as unknown as HTMLElement | null);
    };

    return (
      <StyledListItem
        key={list.id}
        ref={combinedRef}
        style={dragProps.style}
        $type={"sort"}
        {...(dragProps.attributes as DraggableAttributes)}
        {...(dragProps.listeners || {})}
      >
        <SortButton
          onClick={() => animateMove("up")}
          disabled={index === 0 || isAnimating}
        >
          <ArrowUpIcon />
        </SortButton>
        <StyledListContent $type={"sort"}>
          <StyledSpan $ListName>{list.name}</StyledSpan>
          <br />
          <ListMeta>
            {list.id === localListId && <CircleIcon $isActive />}
            <ListMetaText>
              <StyledSpan $comment>
                {`${t("listFrom")}:  ${formatCurrentDate(new Date(list.date), i18n.language)} `}
                {list.taskList.length > 0 && (
                  <>
                    <strong>•</strong>&nbsp;(&nbsp;{t("currentTaskCount.tasks", { count: list.taskList.length ?? 0 })}&nbsp;)&nbsp;
                  </>
                )}
                {list.id === localListId && (
                  <>
                    <strong>•</strong>&nbsp;{t("currentList")}
                  </>
                )}
              </StyledSpan>
            </ListMetaText>
          </ListMeta>
        </StyledListContent>
        <SortButton
          onClick={() => animateMove("down")}
          disabled={index === sortableLists.length - 1 || isAnimating}
        >
          <ArrowDownIcon />
        </SortButton>
      </StyledListItem>
    );
  };

  if (isListsSorting && listsToSort) {
    return withDnd(
      <StyledList>
        {sortableLists.map((list, index) => (
          <SortableListRow key={list.id} list={list} index={index} />
        ))}
      </StyledList>
    );
  }

  return (
    <StyledList>
      {lists?.map((list, index) => (
        <StyledListItem
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() => dispatch(selectList(list.id))}
          $type={"lists"}
        >
          <ToggleButton >{selectedListId === list.id ? "✔" : ""}</ToggleButton>
          <StyledListContent $type={"lists"}>
            <StyledSpan $ListName>{list.name}</StyledSpan>
            <br />
            <ListMeta>
              {list.id === localListId && <CircleIcon $isActive />}
              <ListMetaText>
                <StyledSpan $comment>
                  {`${t("listFrom")}:  ${formatCurrentDate(new Date(list.date), i18n.language)} `}
                  {list.taskList.length > 0 && (
                    <>
                      <strong>•</strong>&nbsp;(&nbsp;{t("currentTaskCount.tasks", { count: list.taskList.length ?? 0 })}&nbsp;)&nbsp;
                    </>
                  )}
                  {list.id === localListId && (
                    <>
                      <strong>•</strong>&nbsp;{t("currentList")}
                    </>
                  )}
                </StyledSpan>
              </ListMetaText>
            </ListMeta>
          </StyledListContent>
          <RemoveButton
            onClick={() => dispatch(setListToRemove(list))}
            disabled={modalIsOpen}
          >
            🗑️
          </RemoveButton>
        </StyledListItem>
      ))}
    </StyledList>
  );
};
