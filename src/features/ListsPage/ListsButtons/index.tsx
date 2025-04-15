import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { StyledLink } from "../../../common/StyledLink";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectIsListsSorting,
  selectLists,
  selectSelectedListById,
  selectSelectedListId,
  setListToLoad,
  switchListSort,
} from "../listsSlice";
import { useTranslation } from "react-i18next";
import { getWidthForSwitchTaskSortButton } from "../../../utils/getWidthForDynamicButtons";

export const ListsButtons = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const lists = useAppSelector(selectLists);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const listToLoad = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "listsPage",
  });
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(switchListSort())}
        disabled={!lists || lists.length < 2}
        width={getWidthForSwitchTaskSortButton(i18n.language)}
      >
        {isListsSorting ? t("buttons.notSort") : t("buttons.sort")}
      </Button>
      <StyledLink to={`/tasks`}>
        <Button
          onClick={() => dispatch(setListToLoad(listToLoad))}
          disabled={selectedListId === null || isListsSorting}
        >
          {t("buttons.load")}
        </Button>
      </StyledLink>
    </ButtonsContainer>
  );
};
