import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { StyledLink } from "../../../common/StyledLink";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectIsListsSorting,
  selectSelectedListById,
  selectSelectedListId,
  setListToLoad,
  switchListSort,
} from "../listsSlice";
import { useTranslation } from "react-i18next";
import { getWidthForSwitchTaskSortButton } from "../../../utils/getWidthForDynamicButtons";
import { refreshData } from "../../../utils/refreshData";
import { useQuery } from "@tanstack/react-query";
import { List } from "../../../types";
import { selectLoggedUserEmail } from "../../AccountPage/accountSlice";

export const ListsButtons = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const listToLoad = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "listsPage",
  });
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);

  const dispatch = useAppDispatch();

  const { data } = useQuery<{ lists: List[] }>({
    queryKey: ["lists"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
  });

  return (
    <ButtonsContainer>
      <Button
        onClick={() => dispatch(switchListSort())}
        disabled={!data?.lists || data.lists.length < 2}
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
