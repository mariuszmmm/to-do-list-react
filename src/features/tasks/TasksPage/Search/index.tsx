import { ChangeEventHandler } from "react";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { Input } from "../../../../common/Input";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { useReplaceQueryParameter } from "../../../../hooks/useReplaceQueryParameter";

export const Search = () => {
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();

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
      autoFocus
    />
  );
};
