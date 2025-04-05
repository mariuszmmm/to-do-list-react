import { useAppDispatch, useAppSelector } from "../../../hooks";
import { StyledLink } from "../../../common/StyledLink";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectSelectedListById,
  selectSelectedListId,
  setListToLoad,
} from "../listsSlice";
import { useTranslation } from "react-i18next";

export const ListsButtons = () => {
  const selectedListId = useAppSelector(selectSelectedListId);
  const listToLoad = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );
  const { t } = useTranslation("translation", {
    keyPrefix: "listsPage",
  });
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      <StyledLink to={`/zadania`}>
        <Button
          onClick={() => dispatch(setListToLoad(listToLoad))}
          disabled={selectedListId === null}
        >
          {t("buttons.load")}
        </Button>
      </StyledLink>
    </ButtonsContainer>
  );
};
