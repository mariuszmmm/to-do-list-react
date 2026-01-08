import { List } from "../../../types";
import { useAppDispatch } from "../../../hooks/redux";
import { useDndList } from "../../../hooks/useDndList";
import { useDndItem } from "../../../hooks/useDndItem";
import {
  ListMeta,
  ListMetaText,
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
} from "../../../common/StyledList";
import { RemoveButton, ToggleButton } from "../../../common/taskButtons";
import {
  selectArchivedList,
  setArchivedListToRemove,
} from "../archivedListsSlice";
import { setArchivedListsOrder } from "../archivedListsSlice";
import { formatCurrentDate } from "../../../utils/formatCurrentDate";
import { useTranslation } from "react-i18next";
import { DraggableAttributes } from "@dnd-kit/core";

type Props = {
  lists: List[];
  selectedListId: string | null;
  modalIsOpen: any;
};

export const TaskLists = ({
  lists,
  selectedListId,
  modalIsOpen,
}: Props) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("translation");

  const { withDnd } = useDndList<List>({
    items: lists,
    isSorting: true,
    getId: (l) => l.id,
    onReorder: (next) => dispatch(setArchivedListsOrder(next)),
  });

  const SortableListRow = ({ list }: { list: List }) => {
    const { dragProps, isDragging } = useDndItem(list.id, true);
    return (
      <StyledListItem
        key={list.id}
        selected={selectedListId === list.id}
        onClick={() => dispatch(selectArchivedList(list.id))}
        $type={"archived"}
        ref={dragProps.setNodeRef}
        $isDragging={isDragging}
        style={dragProps.style}
        {...(dragProps.attributes as DraggableAttributes)}
        {...(dragProps.listeners || {})}
      >
        <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
        <StyledListContent $type={"lists"}>
          <StyledSpan $ListName $isDragging={isDragging}>{list.name}</StyledSpan>
          <br />
          <ListMeta>
            <ListMetaText>
              <StyledSpan $comment>
                {`${t("listFrom")}:  ${formatCurrentDate(new Date(list.date), i18n.language)} `}
                {list.taskList.length > 0 && (
                  <>
                    <strong>•</strong>&nbsp;(&nbsp;{t("currentTaskCount.tasks", { count: list.taskList.length })}&nbsp;)
                  </>
                )}
              </StyledSpan>
            </ListMetaText>
          </ListMeta>
        </StyledListContent>
        <RemoveButton onClick={() => dispatch(setArchivedListToRemove(list))} disabled={modalIsOpen}>
          🗑️
        </RemoveButton>
      </StyledListItem>
    );
  };

  return withDnd(
    <StyledList>
      {lists?.map((list) => (
        <SortableListRow key={list.id} list={list} />
      ))}
    </StyledList>
  );
};
