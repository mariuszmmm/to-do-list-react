import { ChangeEventHandler } from "react";
import { useAppSelector } from "../../../../hooks";
import {
  useQueryParameter,
  useReplaceQueryParameter,
} from "../../../../utils/queryParameter";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { Input } from "../../../../common/Input";
import { selectShowSearch } from "../../tasksSlice";

export const Search = () => {
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();
  const showSearch = useAppSelector(selectShowSearch);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
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
  );
};
