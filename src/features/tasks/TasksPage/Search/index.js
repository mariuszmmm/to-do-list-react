import { useQueryParameter, useReplaceQueryParameter } from "../queryParameter";
import searchQueryParamName from "../searchQueryParamName";
import { Input } from "../../../../common/Input";
import { selectShowSearch } from "../../tasksSlice";
import { useSelector } from "react-redux";

const Search = () => {
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();
  const showSearch = useSelector(selectShowSearch);

  const onInputChange = ({ target }) => {
    replaceQueryParameter({
      key: searchQueryParamName,
      value: target.value.trim() !== "" ? target.value : undefined,
    });
  };

  return (
    <Input
      placeholder="Filtruj zadania"
      value={query || ""}
      onChange={onInputChange}
      hidden={!showSearch}
    />
  )
};

export default Search;