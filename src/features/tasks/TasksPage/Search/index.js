import { useQueryParameter, useReplaceQueryParameter } from "../queryParameter";
import searchQueryParamName from "../searchQueryParamName";
import { Input } from "../../../../common/Input";

const Search = () => {
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();

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
    />
  )
};

export default Search;