import { CSSProperties, useRef } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import { TFunction } from "i18next";
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

type Props = {
  lists: List[];
  selectedListId: string | null;
  modalIsOpen: boolean;
  isListsSorting: boolean;
  listsToSort: List[] | null;
  localListId: string;
};

type DragConfig = {
  setNodeRef: (element: HTMLElement | null) => void;
  style: CSSProperties;
  attributes: DraggableAttributes;
  listeners?: Record<string, unknown>;
};

type ListRowProps = {
  list: List;
  index: number;
  listsLength: number;
  selectedListId: string | null;
  modalIsOpen: boolean;
  isListsSorting: boolean;
  localListId: string;
  t: TFunction;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  dragProps?: DragConfig;
};

const ListRow = ({
  list,
  index,
  listsLength,
  selectedListId,
  modalIsOpen,
  isListsSorting,
  localListId,
  t,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  dragProps,
}: ListRowProps) => {
  const rowRef = useRef<HTMLLIElement | null>(null);
  const setRefs = (el: HTMLLIElement | null) => {
    rowRef.current = el;
    dragProps?.setNodeRef(el as unknown as HTMLElement | null);
  };

  const keepAnchored = (doMove: () => void, direction: "up" | "down") => {
    const scrollEl = document.scrollingElement || document.documentElement || (document.body as HTMLElement);
    const beforeScrollTop = scrollEl.scrollTop;
    const getFullHeight = (el: HTMLElement | null): number => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const styles = getComputedStyle(el);
      const mt = parseFloat(styles.marginTop) || 0;
      const mb = parseFloat(styles.marginBottom) || 0;
      return rect.height + mt + mb;
    };
    const neighbor = direction === "down"
      ? (rowRef.current?.nextElementSibling as HTMLElement | null)
      : (rowRef.current?.previousElementSibling as HTMLElement | null);
    const amountAbs = getFullHeight(neighbor) || getFullHeight(rowRef.current);
    doMove();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const amount = direction === "down" ? amountAbs : -amountAbs;
        if (amount) {
          scrollEl.scrollTop = beforeScrollTop + amount;
        }
      });
    });
  };
  const dragHandlers = dragProps
    ? { ...(dragProps.attributes || {}), ...(dragProps.listeners || {}) }
    : {};

  return (
    <StyledListItem
      ref={isListsSorting ? setRefs : undefined}
      style={dragProps?.style}
      {...dragHandlers}
      selected={selectedListId === list.id && !isListsSorting}
      onClick={!isListsSorting && selectedListId !== list.id ? onSelect : undefined}
      $type={isListsSorting ? "sort" : "lists"}
    >
      {isListsSorting ? (
        <SortButton
          onClick={() => keepAnchored(() => onMoveUp(), "up")}
          disabled={index === 0}
        >
          <ArrowUpIcon />
        </SortButton>
      ) : (
        <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
      )}
      <StyledListContent $type={isListsSorting ? "sort" : "lists"}>
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

      {isListsSorting ? (
        <SortButton
          onClick={() => keepAnchored(() => onMoveDown(), "down")}
          disabled={index === listsLength - 1}
        >
          <ArrowDownIcon />
        </SortButton>
      ) : (
        <RemoveButton
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          disabled={modalIsOpen}
        >
          🗑️
        </RemoveButton>
      )}
    </StyledListItem>
  );
};

const SortableListRow = (props: ListRowProps) => {
  const { list, isListsSorting } = props;
  const { dragProps } = useDndItem(list.id, isListsSorting);
  return <ListRow {...props} dragProps={dragProps} />;
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
  const { withDnd } = useDndList<List>({
    items: sortableLists,
    isSorting: isListsSorting,
    getId: (l) => l.id,
    onReorder: (next) => dispatch(setListToSort(next)),
  });

  if (isListsSorting) {
    return withDnd(
      <StyledList>
        {sortableLists.map((list, index) => (
          <SortableListRow
            key={list.id}
            list={list}
            index={index}
            listsLength={sortableLists.length}
            selectedListId={selectedListId}
            modalIsOpen={modalIsOpen}
            isListsSorting={isListsSorting}
            localListId={localListId}
            t={t}
            onSelect={() => dispatch(selectList(list.id))}
            onMoveUp={() => dispatch(setListToSort(moveListUp(index, sortableLists)))}
            onMoveDown={() => dispatch(setListToSort(moveListDown(index, sortableLists)))}
            onRemove={() => dispatch(setListToRemove(list))}
          />
        ))}
      </StyledList>
    );
  }

  return (
    <StyledList>
      {lists?.map((list, index) => (
        <ListRow
          key={list.id}
          list={list}
          index={index}
          listsLength={lists.length}
          selectedListId={selectedListId}
          modalIsOpen={modalIsOpen}
          isListsSorting={isListsSorting}
          localListId={localListId}
          t={t}
          onSelect={() => dispatch(selectList(list.id))}
          onMoveUp={() => dispatch(setListToSort(moveListUp(index, lists)))}
          onMoveDown={() => dispatch(setListToSort(moveListDown(index, lists)))}
          onRemove={() => dispatch(setListToRemove(list))}
        />
      ))}
    </StyledList>
  );
};

