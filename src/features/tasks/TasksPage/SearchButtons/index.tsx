import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { toggleShowSearch, selectShowSearch } from "../../tasksSlice";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { useReplaceQueryParameter } from "../../../../hooks/useReplaceQueryParameter";
import { useTranslation } from "react-i18next";

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
        onClick={() =>
          replaceQueryParameter({
            key: searchQueryParamName,
          })
        }
        disabled={!query}
        width={i18n.language === "de" ? "140px" : "100px"}
      >
        {t("search.buttons.clear")}
      </Button>
      <Button
        onClick={() => {
          if (showSearch) {
            replaceQueryParameter({
              key: searchQueryParamName,
            });
          }
          dispatch(toggleShowSearch());
        }}
        width={i18n.language === "de" ? "140px" : "100px"}
      >
        {showSearch ? t("search.buttons.hide") : t("search.buttons.show")}
      </Button>
    </ButtonsContainer>
  );
};
