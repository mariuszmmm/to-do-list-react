import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useTranslation } from "react-i18next";
import { StyledLink } from "../../../common/StyledLink";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectSelectedArchivedListId,
  setArchivedListToLoad,
} from "../archivedListsSlice";
import { List } from "../../../types";

type Props = {
  lists: List[];
  selectedListById: List | null;
};

export const ListsButtons = ({ selectedListById }: Props) => {
  const selectedListId = useAppSelector(selectSelectedArchivedListId);
  const dispatch = useAppDispatch();

  const { t } = useTranslation("translation", {
    keyPrefix: "archivedListsPage",
  });

  return (
    <ButtonsContainer>
      <StyledLink to={`/tasks`} disabled={!selectedListId}>
        <Button
          onClick={() => dispatch(setArchivedListToLoad(selectedListById))}
          disabled={!selectedListId}
          aria-label="Load archived list"
        >
          {t("buttons.load")}
        </Button>
      </StyledLink>
    </ButtonsContainer>
  );
};
