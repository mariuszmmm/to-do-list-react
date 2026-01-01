import { ChangeEventHandler, useRef, useEffect } from "react";
import searchQueryParamName from "../../../../utils/searchQueryParamName";
import { Input } from "../../../../common/Input";
import { useQueryParameter } from "../../../../hooks/useQueryParameter";
import { useReplaceQueryParameter } from "../../../../hooks/useReplaceQueryParameter";
import { useTranslation } from "react-i18next";
import { InputWrapper } from "../../../../common/InputWrapper";

export const Search = () => {
  const query = useQueryParameter(searchQueryParamName);
  const replaceQueryParameter = useReplaceQueryParameter();
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.scrollLeft = input.scrollWidth;
    }
  }, [query]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    replaceQueryParameter({
      key: searchQueryParamName,
      value: target.value.trim() !== "" ? target.value : undefined,
    });
  };

  return (
    <InputWrapper>
      <Input
        placeholder={t("search.inputPlaceholder")}
        value={query || ""}
        name="search"
        onChange={onInputChange}
        ref={inputRef}
      />
    </InputWrapper>
  );
};
