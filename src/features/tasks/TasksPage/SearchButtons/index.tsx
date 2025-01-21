import { toggleShowSearch, selectShowSearch } from "../../tasksSlice";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import {
  useQueryParameter,
  useReplaceQueryParameter,
} from "../../../../utils/queryParameter";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

const SearchButtons = () => {
  const dispatch = useAppDispatch();
  const showSearch = useAppSelector(selectShowSearch);
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();

  return (
    <ButtonsContainer>
      <>
        <Button onClick={() => dispatch(toggleShowSearch())}>
          {showSearch ? "Ukryj" : "Pokaż"} filtr
        </Button>
        <Button
          onClick={() =>
            replaceQueryParameter({
              key: searchQueryParamName,
            })
          }
          disabled={!query}
        >
          Wyczyść filtr
        </Button>
      </>
    </ButtonsContainer>
  );
};

export default SearchButtons;
