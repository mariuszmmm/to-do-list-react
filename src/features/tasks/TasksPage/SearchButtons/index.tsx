import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { toggleShowSearch, selectShowSearch } from "../../tasksSlice";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { useReplaceQueryParameter } from "../../../../hooks/useReplaceQueryParameter";
import { useTranslation } from "react-i18next";
import { getWidthForToggleShowSearchButton } from "../../../../utils/getWidthForDynamicButtons";

export const SearchButtons = () => {
  const dispatch = useAppDispatch();
  const showSearch = useAppSelector(selectShowSearch);
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  return (
    <ButtonsContainer>
      <Button
        onClick={() => {
          if (showSearch) {
            replaceQueryParameter({
              key: searchQueryParamName,
            });
          }
          dispatch(toggleShowSearch());
        }}
        width={getWidthForToggleShowSearchButton(i18n.language)}
      >
        {showSearch ? t("search.buttons.hide") : t("search.buttons.show")}
      </Button>
      <Button
        onClick={() =>
          replaceQueryParameter({
            key: searchQueryParamName,
          })
        }
        disabled={!query}
      >
        {t("search.buttons.clear")}
      </Button>
    </ButtonsContainer>
  );
};
