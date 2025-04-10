import { ChangeEventHandler } from "react";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { Input } from "../../../../common/Input";
import { useQueryParameter } from "../../../../hooks/useQuery/useQueryParameter";
import { useReplaceQueryParameter } from "../../../../hooks/useQuery/useReplaceQueryParameter";
import { useTranslation } from "react-i18next";

export const Search = () => {
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  const onInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    replaceQueryParameter({
      key: searchQueryParamName,
      value: target.value.trim() !== "" ? target.value : undefined,
    });
  };

  return (
    <Input
      placeholder={t("search.inputPlaceholder")}
      value={query || ""}
      onChange={onInputChange}
    />
  );
};
