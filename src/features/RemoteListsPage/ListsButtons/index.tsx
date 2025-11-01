import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { Button } from "../../../common/Button";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { StyledLink } from "../../../common/StyledLink";
import { List } from "../../../types";
import { getWidthForSwitchTaskSortButton } from "../../../utils/getWidthForDynamicButtons";
import {
  selectIsListsSorting,
  selectSelectedListId,
  setListToLoad,
  switchListSort,
} from "../remoteListsSlice";

type Props = {
  lists: List[];
  selectedListById: List | null;
};

export const ListsButtons = ({ lists, selectedListById }: Props) => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "remoteListsPage",
  });

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(switchListSort())}
        disabled={lists.length < 2}
        width={getWidthForSwitchTaskSortButton(i18n.language)}
      >
        {isListsSorting ? t("buttons.notSort") : t("buttons.sort")}
      </Button>
      <StyledLink to={`/tasks`} disabled={!selectedListId || isListsSorting}>
        <Button
          onClick={() => dispatch(setListToLoad(selectedListById))}
          disabled={!selectedListId || isListsSorting}
        >
          {t("buttons.load")}
        </Button>
      </StyledLink>
    </ButtonsContainer>
  );
};
