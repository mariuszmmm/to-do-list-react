import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useTranslation } from "react-i18next";
import { StyledLink } from "../../../common/StyledLink";
import { List, ListsData } from "../../../types";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectIsListsSorting,
  selectSelectedListId,
  setListToLoad,
  switchListSort,
} from "../listsSlice";
import { getWidthForSwitchTaskSortButton } from "../../../utils/getWidthForDynamicButtons";

type Props = {
  listsData: ListsData;
  selectedListById: List | null;
};

export const ListsButtons = ({ listsData, selectedListById }: Props) => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "listsPage",
  });

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(switchListSort())}
        disabled={!listsData?.lists || listsData.lists.length < 2}
        width={getWidthForSwitchTaskSortButton(i18n.language)}
      >
        {isListsSorting ? t("buttons.notSort") : t("buttons.sort")}
      </Button>
      <StyledLink to={`/tasks`}>
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
