import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { ButtonsContainer } from "../../../../common/ButtonsContainer";
import { Button } from "../../../../common/Button";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { toggleShowSearch, selectShowSearch } from "../../tasksSlice";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { useReplaceQueryParameter } from "../../../../hooks/useReplaceQueryParameter";

export const SearchButtons = () => {
  const dispatch = useAppDispatch();
  const showSearch = useAppSelector(selectShowSearch);
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();

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
        width="100px"
      >
        {showSearch ? "Ukryj" : "Pokaż"} filtr
      </Button>
      <Button
        onClick={() =>
          replaceQueryParameter({
            key: searchQueryParamName,
          })
        }
        disabled={!query}
        width="100px"
      >
        Wyczyść filtr
      </Button>
    </ButtonsContainer>
  );
};
