import { List } from "../../../types";
import { useAppDispatch } from "../../../hooks/redux";
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
import { formatCurrentDate } from "../../../utils/formatCurrentDate";
import { useTranslation } from "react-i18next";

type Props = {
  lists: List[];
  selectedListId: string | null;
  modalIsOpen: any;
  isListsSorting: boolean;
};

export const TaskLists = ({
  lists,
  selectedListId,
  modalIsOpen,
  isListsSorting,
}: Props) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("translation");

  return (
    <StyledList>
      {lists?.map((list) => (
        <StyledListItem
          key={list.id}
          selected={selectedListId === list.id && !isListsSorting}
          onClick={() =>
            dispatch(selectArchivedList(isListsSorting ? null : list.id))
          }
          $type={"lists"}
        >
          <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
          <StyledListContent $type={"lists"}>
            <StyledSpan $ListName>{list.name}</StyledSpan>
            <br />
            <ListMeta>
              <ListMetaText>
                <StyledSpan $comment>
                  {`${t("listFrom")}:  ${formatCurrentDate(new Date(list.date), i18n.language)} `}
                  {list.taskList.length > 0 && <><strong>•</strong>&nbsp;(&nbsp;{t('currentTaskCount.tasks', { count: list.taskList.length })}&nbsp;)</>}
                </StyledSpan>
              </ListMetaText>
            </ListMeta>
          </StyledListContent>
          <RemoveButton
            onClick={() => dispatch(setArchivedListToRemove(list))}
            disabled={modalIsOpen}
          >
            🗑️
          </RemoveButton>
        </StyledListItem>
      ))}
    </StyledList>
  );
};
