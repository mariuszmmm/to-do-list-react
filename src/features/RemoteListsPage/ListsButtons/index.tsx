import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux/redux";
import { Button } from "../../../common/Button";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { List } from "../../../types";
import { getWidthForSwitchTaskSortButton } from "../../../utils/ui/getWidthForDynamicButtons";
import { selectIsListsSorting, switchListSort } from "../remoteListsSlice";

type Props = {
  lists: List[];
};

export const ListsButtons = ({ lists }: Props) => {
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
    </ButtonsContainer>
  );
};
