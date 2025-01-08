import { useDispatch, useSelector } from "react-redux";
import { toggleShowSearch, selectShowSearch } from "../../tasksSlice";
import ButtonsContainer from "../../../../common/ButtonsContainer";
import Button from "../../../../common/Button";
import searchQueryParamName from "../searchQueryParamName";
import { useQueryParameter, useReplaceQueryParameter } from "../queryParameter";

const SearchButtons = () => {
  const dispatch = useDispatch();
  const showSearch = useSelector(selectShowSearch);
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();

  return (
    <ButtonsContainer>
      <>
        <Button
          onClick={() => replaceQueryParameter({
            key: searchQueryParamName,
          })}
          disabled={!query}
        >
          Wyczyść filtr
        </Button>
        <Button
          onClick={() => dispatch(toggleShowSearch())}
        >
          {showSearch ? "Ukryj filtr" : "Pokaż filtr"}
        </Button>
      </>
    </ButtonsContainer>
  )
};

export default SearchButtons;