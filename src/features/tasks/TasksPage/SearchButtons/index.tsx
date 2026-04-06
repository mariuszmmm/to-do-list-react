import { useAppDispatch, useAppSelector } from "../../../../hooks/redux/redux";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import searchQueryParamName from "../../../../utils/navigation/searchQueryParamName";
import { toggleShowSearch, selectShowSearch, selectIsTasksSorting } from "../../tasksSlice";
import { useQueryParameter } from "../../../../hooks/navigation/useQueryParameter";
import { useReplaceQueryParameter } from "../../../../hooks/navigation/useReplaceQueryParameter";
import { useTranslation } from "react-i18next";
import { getWidthForToggleShowSearchButton } from "../../../../utils/ui/getWidthForDynamicButtons";
import { useEffect } from "react";

export const SearchButtons = () => {
  const dispatch = useAppDispatch();
  const showSearch = useAppSelector(selectShowSearch);
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  useEffect(() => {
    if (isTasksSorting) {
      showSearch && dispatch(toggleShowSearch());
      query &&
        replaceQueryParameter({
          key: searchQueryParamName,
        });
    }
  }, [isTasksSorting, showSearch, query, replaceQueryParameter, dispatch]);

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
        disabled={isTasksSorting}
      >
        {showSearch ? t("search.buttons.hide") : t("search.buttons.show")}
      </Button>
      <Button
        onClick={() =>
          replaceQueryParameter({
            key: searchQueryParamName,
          })
        }
        disabled={!query || isTasksSorting}
        aria-label='Clear search'
      >
        {t("search.buttons.clear")}
      </Button>
    </ButtonsContainer>
  );
};
