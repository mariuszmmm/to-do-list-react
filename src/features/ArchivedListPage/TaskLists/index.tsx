import { List } from "../../../types";
import { useAppDispatch } from "../../../hooks/redux";
import {
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
          $type={"tasks"}
        >
          <ToggleButton>{selectedListId === list.id ? "✔" : ""}</ToggleButton>
          <StyledListContent $type={"tasks"}>
            <StyledSpan $ListName>{list.name}</StyledSpan>
            <br />
            <StyledSpan $comment>
              {`${t("listFrom")}:  ${formatCurrentDate(new Date(list.date), i18n.language)}`}
              <strong> •</strong>{` (`}&nbsp;
              {t('currentTaskCount.tasks', { count: list.taskList.length ?? 0 })}
              &nbsp;{`)`}
            </StyledSpan>
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
